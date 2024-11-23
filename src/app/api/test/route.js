import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

export async function GET() {
  try {
    // Test direct profile access
    const { data: directProfile, error: directError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', 'monkey')
      .single();

    // Test all profiles
    const { data: allProfiles, error: allError } = await supabase
      .from('profiles')
      .select('id, username')
      .limit(5);

    return NextResponse.json({
      success: true,
      directProfile,
      directError,
      allProfiles,
      allError,
      config: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        stack: error.stack
      }
    }, { status: 500 });
  }
}
