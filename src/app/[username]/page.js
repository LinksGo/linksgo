import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import PublicProfileClient from './public-profile-client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased timeout to 15 seconds

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        keepalive: true // Keep connection alive
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) throw error;
      // Exponential backoff with jitter
      const delay = Math.min(1000 * Math.pow(2, i) + Math.random() * 1000, 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function getProfileAndLinks(username) {
  if (!username) {
    console.error('No username provided');
    return null;
  }

  const fetchOptions = {
    method: 'GET',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Prefer': 'return=representation'
    }
  };

  try {
    // Fetch profile
    console.log('Fetching profile for:', username);
    const profileUrl = `${supabaseUrl}/rest/v1/profiles?username=eq.${encodeURIComponent(username.toLowerCase())}`;
    const response = await fetchWithRetry(profileUrl, fetchOptions);
    const profiles = await response.json();

    if (!profiles || profiles.length === 0) {
      console.log('No profile found for username:', username);
      return null;
    }

    const profile = profiles[0];
    console.log('Profile found:', profile.id);

    // Fetch links and appearance in parallel
    const [links, appearanceSettings] = await Promise.all([
      fetchWithRetry(
        `${supabaseUrl}/rest/v1/links?user_id=eq.${profile.id}&is_active=eq.true&order=position`,
        fetchOptions
      ).then(res => res.json()),
      fetchWithRetry(
        `${supabaseUrl}/rest/v1/appearance_settings?user_id=eq.${profile.id}&limit=1`,
        fetchOptions
      ).then(res => res.json())
    ]);

    console.log('Links fetched:', links.length);
    
    const appearance = appearanceSettings.length > 0 ? appearanceSettings[0] : {
      theme: 'system',
      primary_color: '#000000',
      user_id: profile.id
    };

    console.log('Data fetched successfully');
    return { profile, links, appearance };
  } catch (error) {
    console.error('Error in getProfileAndLinks:', error.message);
    if (error.name === 'AbortError') {
      console.error('Request timed out');
    }
    return null;
  }
}

export default async function PublicProfilePage({ params }) {
  try {
    const username = params?.username ? decodeURIComponent(params.username) : null;
    
    if (!username) {
      console.log('No username provided in params');
      return notFound();
    }

    console.log('Fetching data for username:', username);
    const data = await getProfileAndLinks(username);
    
    if (!data?.profile) {
      console.log('No profile data found');
      return notFound();
    }

    return (
      <PublicProfileClient
        profile={data.profile}
        links={data.links}
        appearance={data.appearance}
        username={username}
      />
    );
  } catch (error) {
    console.error('Error in PublicProfilePage:', error);
    return notFound();
  }
}
