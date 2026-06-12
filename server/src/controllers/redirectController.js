import Link from '../models/Link.js';
import Analytics from '../models/Analytics.js';
import { parseAnalyticsData } from '../utils/parseAnalytics.js';

export const redirectLink = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // Skip API-like paths
    if (shortCode.startsWith('api') || shortCode === 'favicon.ico') {
      return res.status(404).json({ message: 'Not found' });
    }

    const link = await Link.findOne({ $or: [{ shortCode }, { customAlias: shortCode }] });

    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();

    if (!link) {
      return res.redirect(`${clientUrl}/link-status?status=notfound`);
    }

    if (link.status === 'disabled') {
      return res.redirect(`${clientUrl}/link-status?status=disabled&code=${link.shortCode}`);
    }

    if (link.expiryDate && new Date(link.expiryDate) < new Date()) {
      link.status = 'expired';
      await link.save();
      return res.redirect(`${clientUrl}/link-status?status=expired&code=${link.shortCode}`);
    }

    link.clickCount += 1;
    link.lastVisited = new Date();
    await link.save();

    const analyticsData = parseAnalyticsData(req);
    Analytics.create({ link: link._id, ...analyticsData }).catch(() => {}); // Non-blocking

    return res.redirect(302, link.originalUrl);
  } catch (error) {
    next(error);
  }
};