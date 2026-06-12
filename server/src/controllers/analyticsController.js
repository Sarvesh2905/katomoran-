import Analytics from '../models/Analytics.js';
import Link from '../models/Link.js';
import { subDays, startOfDay, format } from 'date-fns';

// ─── Per-Link Analytics ──────────────────────────────────────────────────────

export const getLinkAnalytics = async (req, res, next) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, user: req.user._id });
    if (!link) return res.status(404).json({ message: 'Link not found' });

    // Determine range (7, 30, or 90 days)
    const days = Math.min(90, Math.max(7, parseInt(req.query.days) || 7));

    const totalClicks = await Analytics.countDocuments({ link: req.params.id });
    const uniqueVisitors = await Analytics.distinct('ipAddress', { link: req.params.id });

    const [deviceStats, browserStats, countryStats, referrerStats, osStats] = await Promise.all([
      Analytics.aggregate([
        { $match: { link: link._id } },
        { $group: { _id: '$device', count: { $sum: 1 } } }
      ]),
      Analytics.aggregate([
        { $match: { link: link._id } },
        { $group: { _id: '$browser', count: { $sum: 1 } } }
      ]),
      Analytics.aggregate([
        { $match: { link: link._id } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Analytics.aggregate([
        { $match: { link: link._id } },
        { $group: { _id: '$referrer', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Analytics.aggregate([
        { $match: { link: link._id } },
        { $group: { _id: '$os', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    const recentVisits = await Analytics.find({ link: link._id })
      .sort({ timestamp: -1 })
      .limit(50)
      .select('timestamp device browser country city referrer os');

    // Build daily click array for requested range
    const dailyClicks = await buildDailyClicks(link._id, days);

    const insights = generateInsights(link, totalClicks, deviceStats, browserStats, countryStats, dailyClicks);

    res.json({
      success: true,
      analytics: {
        totalClicks,
        uniqueVisitors: uniqueVisitors.length,
        lastVisited: link.lastVisited,
        deviceStats: deviceStats.map(d => ({ name: d._id, value: d.count })),
        browserStats: browserStats.map(b => ({ name: b._id, value: b.count })),
        osStats: osStats.map(o => ({ name: o._id, value: o.count })),
        countryStats: countryStats.map(c => ({ name: c._id, value: c.count })),
        referrerStats: referrerStats.map(r => ({ name: r._id, value: r.count })),
        dailyClicks,
        recentVisits,
        insights,
        days
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─── Global Analytics (all links for this user) ───────────────────────────────

export const getGlobalAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const links = await Link.find({ user: userId }).lean();
    const linkIds = links.map(l => l._id);

    const thisWeekStart = subDays(now, 7);
    const lastWeekStart = subDays(now, 14);
    const thisMonthStart = subDays(now, 30);
    const lastMonthStart = subDays(now, 60);

    const totalClicks = links.reduce((sum, l) => sum + (l.clickCount || 0), 0);
    const activeLinks = links.filter(l => l.status === 'active').length;
    const disabledLinks = links.filter(l => l.status === 'disabled').length;
    const expiredLinks = links.filter(l => l.status === 'expired').length;

    // Growth metrics from Analytics collection
    const [thisWeekClicks, lastWeekClicks, thisMonthClicks, lastMonthClicks] = await Promise.all([
      Analytics.countDocuments({ link: { $in: linkIds }, timestamp: { $gte: thisWeekStart } }),
      Analytics.countDocuments({ link: { $in: linkIds }, timestamp: { $gte: lastWeekStart, $lt: thisWeekStart } }),
      Analytics.countDocuments({ link: { $in: linkIds }, timestamp: { $gte: thisMonthStart } }),
      Analytics.countDocuments({ link: { $in: linkIds }, timestamp: { $gte: lastMonthStart, $lt: thisMonthStart } })
    ]);

    const calcGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const weeklyGrowth = calcGrowth(thisWeekClicks, lastWeekClicks);
    const monthlyGrowth = calcGrowth(thisMonthClicks, lastMonthClicks);

    // Geolocation + top stats
    const [countriesDistinct, topCountryAgg, topBrowserAgg, topDeviceAgg] = await Promise.all([
      Analytics.distinct('country', { link: { $in: linkIds }, country: { $ne: 'Unknown' } }),
      Analytics.aggregate([
        { $match: { link: { $in: linkIds }, country: { $ne: 'Unknown' } } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 1 }
      ]),
      Analytics.aggregate([
        { $match: { link: { $in: linkIds } } },
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 1 }
      ]),
      Analytics.aggregate([
        { $match: { link: { $in: linkIds } } },
        { $group: { _id: '$device', count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 1 }
      ])
    ]);

    // Top URL (most clicks)
    const topUrl = [...links].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))[0];

    // Fastest growing this week
    const weeklyLinkClicks = await Promise.all(
      links.map(async (link) => {
        const wClicks = await Analytics.countDocuments({ link: link._id, timestamp: { $gte: thisWeekStart } });
        return { link, weekClicks: wClicks };
      })
    );
    const fastestGrowing = weeklyLinkClicks.sort((a, b) => b.weekClicks - a.weekClicks)[0];

    // 30-day daily clicks (global)
    const dailyRaw = await Analytics.aggregate([
      { $match: { link: { $in: linkIds }, timestamp: { $gte: subDays(now, 29) } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      }
    ]);

    const dailyClicks = Array.from({ length: 30 }, (_, i) => {
      const date = startOfDay(subDays(now, 29 - i));
      const label = format(date, 'MMM dd');
      const found = dailyRaw.find(d => d._id === format(date, 'yyyy-MM-dd'));
      return { date: label, clicks: found ? found.count : 0 };
    });

    // SaaS insights
    const saasInsights = generateSaasInsights({
      links, totalClicks, weeklyGrowth, monthlyGrowth,
      thisWeekClicks, lastWeekClicks,
      topCountry: topCountryAgg[0]?._id,
      topDevice: topDeviceAgg[0]?._id,
      topBrowser: topBrowserAgg[0]?._id,
      fastestGrowing
    });

    res.json({
      success: true,
      global: {
        totalLinks: links.length,
        totalClicks,
        activeLinks,
        disabledLinks,
        expiredLinks,
        countriesReached: countriesDistinct.length,
        weeklyClicks: thisWeekClicks,
        lastWeekClicks,
        weeklyGrowth,
        monthlyClicks: thisMonthClicks,
        lastMonthClicks,
        monthlyGrowth,
        topUrl: topUrl
          ? { title: topUrl.title || topUrl.shortCode, shortCode: topUrl.shortCode, clicks: topUrl.clickCount }
          : null,
        topCountry: topCountryAgg[0]?._id || 'N/A',
        topBrowser: topBrowserAgg[0]?._id || 'N/A',
        topDevice: topDeviceAgg[0]?._id || 'N/A',
        fastestGrowing: fastestGrowing && fastestGrowing.weekClicks > 0
          ? { title: fastestGrowing.link.title || fastestGrowing.link.shortCode, shortCode: fastestGrowing.link.shortCode, weekClicks: fastestGrowing.weekClicks }
          : null,
        dailyClicks,
        saasInsights
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─── CSV Export ────────────────────────────────────────────────────────────────

export const exportAnalyticsCSV = async (req, res, next) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!link) return res.status(404).json({ message: 'Link not found' });

    const analyticsRows = await Analytics.find({ link: link._id }).sort({ timestamp: -1 }).lean();

    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

    const summarySection = [
      '# LINK SUMMARY',
      ['Property', 'Value'].map(escape).join(','),
      ['Short Code', link.shortCode].map(escape).join(','),
      ['Custom Alias', link.customAlias || 'None'].map(escape).join(','),
      ['Title', link.title || 'Untitled'].map(escape).join(','),
      ['Destination URL', link.originalUrl].map(escape).join(','),
      ['Status', link.status].map(escape).join(','),
      ['Total Clicks', link.clickCount].map(escape).join(','),
      ['Created', format(new Date(link.createdAt), 'yyyy-MM-dd HH:mm:ss')].map(escape).join(','),
      ['Expiry', link.expiryDate ? format(new Date(link.expiryDate), 'yyyy-MM-dd HH:mm:ss') : 'Never'].map(escape).join(','),
    ].join('\n');

    const clickSection = [
      '',
      '# CLICK EVENTS',
      ['Timestamp', 'Device', 'Browser', 'OS', 'Country', 'State', 'City', 'Referrer', 'IP'].map(escape).join(','),
      ...analyticsRows.map(a => [
        format(new Date(a.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        a.device, a.browser, a.os,
        a.country, a.state, a.city,
        a.referrer, a.ipAddress
      ].map(escape).join(','))
    ].join('\n');

    const footer = `\n# Generated: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}\n# Katomaran Link Analytics`;

    const csvContent = summarySection + clickSection + footer;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="katomaran-${link.shortCode}-${format(new Date(), 'yyyy-MM-dd')}.csv"`);
    res.send(csvContent);
  } catch (error) {
    next(error);
  }
};

// ─── Public Stats ──────────────────────────────────────────────────────────────

export const getPublicStats = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const link = await Link.findOne({ $or: [{ shortCode }, { customAlias: shortCode }] });
    if (!link) return res.status(404).json({ message: 'Link not found' });

    const [deviceStats, browserStats, countryStats] = await Promise.all([
      Analytics.aggregate([{ $match: { link: link._id } }, { $group: { _id: '$device', count: { $sum: 1 } } }]),
      Analytics.aggregate([{ $match: { link: link._id } }, { $group: { _id: '$browser', count: { $sum: 1 } } }]),
      Analytics.aggregate([
        { $match: { link: link._id } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 10 }
      ])
    ]);

    const dailyClicks = await buildDailyClicks(link._id, 7);

    res.json({
      success: true,
      stats: {
        originalUrl: link.originalUrl,
        shortCode: link.shortCode,
        customAlias: link.customAlias,
        title: link.title,
        qrCode: link.qrCode,
        clickCount: link.clickCount,
        lastVisited: link.lastVisited,
        createdAt: link.createdAt,
        expiryDate: link.expiryDate,
        status: link.status,
        deviceStats: deviceStats.map(d => ({ name: d._id, value: d.count })),
        browserStats: browserStats.map(b => ({ name: b._id, value: b.count })),
        countryStats: countryStats.map(c => ({ name: c._id, value: c.count })),
        dailyClicks
      }
    });
  } catch (error) {
    next(error);
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function buildDailyClicks(linkId, days) {
  const now = new Date();
  const since = subDays(now, days - 1);

  const rawStats = await Analytics.aggregate([
    { $match: { link: linkId, timestamp: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        count: { $sum: 1 }
      }
    }
  ]);

  return Array.from({ length: days }, (_, i) => {
    const date = startOfDay(subDays(now, days - 1 - i));
    const label = format(date, 'MMM dd');
    const found = rawStats.find(d => d._id === format(date, 'yyyy-MM-dd'));
    return { date: label, clicks: found ? found.count : 0 };
  });
}

function generateInsights(link, totalClicks, deviceStats, browserStats, countryStats, dailyClicks) {
  const insights = [];
  const recentHalf = dailyClicks.slice(Math.floor(dailyClicks.length / 2));
  const olderHalf = dailyClicks.slice(0, Math.floor(dailyClicks.length / 2));
  const recentTotal = recentHalf.reduce((a, b) => a + b.clicks, 0);
  const olderTotal = olderHalf.reduce((a, b) => a + b.clicks, 0);

  if (recentTotal > olderTotal && olderTotal > 0) {
    const growth = Math.round(((recentTotal - olderTotal) / olderTotal) * 100);
    insights.push({ type: 'trend', message: `Traffic increased ${growth}% in recent days.`, icon: 'trending-up' });
  }

  const topDevice = [...deviceStats].sort((a, b) => b.count - a.count)[0];
  if (topDevice && totalClicks > 0) {
    const pct = Math.round((topDevice.count / totalClicks) * 100) || 0;
    const label = topDevice._id === 'desktop' ? 'Desktop' : topDevice._id === 'mobile' ? 'Mobile' : 'Tablet';
    insights.push({ type: 'device', message: `${label} users generated ${pct}% of clicks.`, icon: 'smartphone' });
  }

  const topBrowser = [...browserStats].sort((a, b) => b.count - a.count)[0];
  if (topBrowser) {
    insights.push({ type: 'browser', message: `Top browser: ${topBrowser._id}.`, icon: 'globe' });
  }

  const topCountry = [...countryStats].sort((a, b) => b.count - a.count)[0];
  if (topCountry && topCountry._id !== 'Unknown') {
    insights.push({ type: 'geo', message: `Most traffic from ${topCountry._id}.`, icon: 'map-pin' });
  }

  if (link.clickCount > 100) insights.push({ type: 'popular', message: 'This is a highly popular link!', icon: 'flame' });
  if (link.clickCount === 0) insights.push({ type: 'tip', message: 'Share this link to start tracking analytics.', icon: 'lightbulb' });

  return insights;
}

function generateSaasInsights({ links, totalClicks, weeklyGrowth, monthlyGrowth, thisWeekClicks, topCountry, topDevice, topBrowser, fastestGrowing }) {
  const insights = [];

  if (weeklyGrowth > 0) {
    insights.push({ type: 'growth', message: `Traffic increased ${weeklyGrowth}% this week.`, icon: 'trending-up' });
  } else if (weeklyGrowth < 0) {
    insights.push({ type: 'decline', message: `Traffic decreased ${Math.abs(weeklyGrowth)}% this week.`, icon: 'trending-down' });
  }

  if (topDevice && topDevice !== 'unknown') {
    insights.push({ type: 'device', message: `${topDevice === 'mobile' ? 'Mobile' : topDevice === 'desktop' ? 'Desktop' : 'Tablet'} is your top device type.`, icon: 'smartphone' });
  }

  if (topCountry && topCountry !== 'N/A') {
    insights.push({ type: 'geo', message: `Most of your traffic comes from ${topCountry}.`, icon: 'map-pin' });
  }

  if (fastestGrowing && fastestGrowing.weekClicks > 0) {
    const name = fastestGrowing.title || fastestGrowing.shortCode || 'your link';
    insights.push({ type: 'fastest', message: `"${name}" is your fastest growing link (${fastestGrowing.weekClicks} clicks this week).`, icon: 'flame' });
  }

  if (thisWeekClicks === 0 && links.length > 0) {
    insights.push({ type: 'tip', message: 'No clicks this week. Share your links to get analytics.', icon: 'lightbulb' });
  }

  return insights;
}