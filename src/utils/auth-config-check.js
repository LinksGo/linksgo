export async function checkAuthConfig() {
  const config = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
  };

  const issues = [];

  // Check Supabase URL format
  if (!config.supabaseUrl) {
    issues.push('NEXT_PUBLIC_SUPABASE_URL is missing');
  } else if (!config.supabaseUrl.startsWith('https://')) {
    issues.push('NEXT_PUBLIC_SUPABASE_URL must start with https://');
  }

  // Check Anon Key
  if (!config.hasAnonKey) {
    issues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
  }

  // Check App URL
  if (!config.appUrl) {
    issues.push('NEXT_PUBLIC_APP_URL is missing');
  } else {
    try {
      new URL(config.appUrl);
    } catch {
      issues.push('NEXT_PUBLIC_APP_URL is not a valid URL');
    }
  }

  // Check redirect URL format
  const redirectUrl = `${config.appUrl}/auth/callback`;
  try {
    new URL(redirectUrl);
  } catch {
    issues.push('Invalid redirect URL format');
  }

  return {
    valid: issues.length === 0,
    issues,
    config: {
      ...config,
      redirectUrl,
    },
  };
}
