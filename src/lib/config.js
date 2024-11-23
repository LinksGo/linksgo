// Default configuration with fallbacks
export const getConfig = () => {
  return {
    // Use environment variable or default to localhost for development
    domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'localhost:3000',
    // Add other configuration items here
  };
};

// Get the full profile URL for a username
export const getProfileUrl = (username) => {
  const config = getConfig();
  const protocol = config.domain.includes('localhost') ? 'http://' : 'https://';
  return `${protocol}${config.domain}/${username}`;
};
