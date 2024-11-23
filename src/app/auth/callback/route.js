import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Generate a random string of specified length
function generateRandomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate a unique username
async function generateUniqueUsername(supabase, baseUsername) {
  let username = baseUsername;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 5;

  while (!isUnique && attempts < maxAttempts) {
    // Add random string if not first attempt
    if (attempts > 0) {
      username = `${baseUsername}${generateRandomString(4)}`;
    }

    // Check if username exists
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (error && error.code === 'PGRST116') {
      // Error code PGRST116 means no rows returned
      isUnique = true;
    } else {
      attempts++;
    }
  }

  // If we couldn't find a unique username with the base, generate a completely random one
  if (!isUnique) {
    username = `user${generateRandomString(8)}`;
  }

  return username;
}

export async function GET(request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (!code) {
      console.error('No code provided in callback')
      return NextResponse.redirect(
        new URL('/login?error=No authentication code received', request.url)
      )
    }

    // Create a response early to handle cookies
    const response = NextResponse.redirect(new URL('/dashboard', request.url))

    // Initialize Supabase client with async cookies
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient(
      { cookies: () => cookieStore },
      {
        auth: {
          flowType: 'pkce',
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true
        }
      }
    )

    try {
      // Exchange code for session
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

      if (sessionError) {
        console.error('Session error:', sessionError)
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(sessionError.message)}`, request.url)
        )
      }

      if (!session) {
        console.error('No session returned')
        return NextResponse.redirect(
          new URL('/login?error=No session returned', request.url)
        )
      }

      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single();

      // If no profile exists, create one with a generated username
      if (!existingProfile) {
        const baseUsername = session.user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        const username = await generateUniqueUsername(supabase, baseUsername);

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            username: username,
            email: session.user.email,
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          return NextResponse.redirect(
            new URL(`/login?error=${encodeURIComponent('Failed to create profile')}`, request.url)
          );
        }
      }

      // Successful authentication
      return response
    } catch (error) {
      console.error('Authentication error:', error)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
      )
    }
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
    )
  }
}
