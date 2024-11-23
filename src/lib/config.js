// Default configuration with fallbacks
export const getConfig = () => {
  return {
    // Use environment variable or default to production domain
    domain: process.env.NEXT_PUBLIC_APP_DOMAIN || 'linksgo.d2718nyykyu03k.amplifyapp.com',
    // Add other configuration items here
  };
};

// Get the full profile URL for a username
export const getProfileUrl = (username) => {
  const config = getConfig();
  const protocol = config.domain.includes('localhost') ? 'http://' : 'https://';
  return `${protocol}${config.domain}/${username}`;
};
