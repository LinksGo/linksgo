'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function TestPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    async function fetchData() {
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

        setData({
          directProfile,
          directError,
          allProfiles,
          allError,
          config: {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          }
        });
      } catch (err) {
        setError(err.message);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace', color: 'red' }}>
        <h1>Error</h1>
        <pre>{error}</pre>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Information</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
