import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';

export const parseAnalyticsData = (req) => {
  const uaString = req.headers['user-agent'] || '';
  const ua = UAParser(uaString);
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.connection?.remoteAddress || '0.0.0.0';
  const geo = geoip.lookup(ip) || {};

  const deviceType = ua.device?.type || 'desktop';
  const browserName = (ua.browser?.name || 'Unknown').toLowerCase();
  const osName = ua.os?.name || 'Unknown';

  const browser = browserName.includes('chrome') ? 'Chrome' :
                  browserName.includes('firefox') ? 'Firefox' :
                  browserName.includes('safari') ? 'Safari' :
                  browserName.includes('edge') ? 'Edge' :
                  browserName.includes('opera') ? 'Opera' : 'Other';

  let referrer = req.headers.referer || req.headers.referrer || 'Direct';
  let source = 'Direct';
  const r = referrer.toLowerCase();
  if (r.includes('google')) source = 'Google';
  else if (r.includes('facebook') || r.includes('fb.')) source = 'Facebook';
  else if (r.includes('instagram')) source = 'Instagram';
  else if (r.includes('linkedin')) source = 'LinkedIn';
  else if (r.includes('twitter') || r.includes('x.com')) source = 'Twitter/X';
  else if (r.includes('whatsapp')) source = 'WhatsApp';
  else if (r.includes('telegram')) source = 'Telegram';
  else if (r !== 'direct') source = 'Other';

  return {
    ipAddress: ip,
    userAgent: uaString,
    device: deviceType === 'mobile' ? 'mobile' : deviceType === 'tablet' ? 'tablet' : 'desktop',
    browser,
    os: osName,
    country: geo.country || 'Unknown',
    state: geo.region || 'Unknown',
    city: geo.city || 'Unknown',
    referrer: source
  };
};