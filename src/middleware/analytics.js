import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import UAParser from 'ua-parser-js';

export async function trackLinkClick(req, supabase, linkId) {
  try {
    // Parse user agent
    const ua = new UAParser(req.headers.get('user-agent'));
    const device = ua.getDevice().type || 'desktop';
    const browser = ua.getBrowser().name || 'unknown';
    const os = ua.getOS().name || 'unknown';

    // Get visitor's IP and location
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const country = req.headers.get('x-vercel-ip-country') || 'unknown';
    const city = req.headers.get('x-vercel-ip-city') || 'unknown';

    // Generate a visitor ID (hash of IP + user agent)
    const visitorId = await generateVisitorId(ip, req.headers.get('user-agent'));

    // Get referrer
    const referrer = req.headers.get('referer') || 'direct';

    // Insert analytics data
    const { error } = await supabase
      .from('link_analytics')
      .insert({
        link_id: linkId,
        visitor_id: visitorId,
        country,
        city,
        device,
        browser,
        os,
        referrer
      });

    if (error) {
      console.error('Error tracking link click:', error);
    }
  } catch (error) {
    console.error('Error in analytics middleware:', error);
  }
}

async function generateVisitorId(ip, userAgent) {
  // Create a hash of IP + user agent to identify unique visitors
  // while maintaining privacy
  const text = `${ip}-${userAgent}`;
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
