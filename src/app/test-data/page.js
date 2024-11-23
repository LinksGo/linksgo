'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

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

export default function TestDataPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get the monkey profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', 'monkey')
          .single();

        if (!profile) {
          throw new Error('Profile not found');
        }

        // Get links for this profile
        const { data: links, error: linksError } = await supabase
          .from('links')
          .select('*')
          .eq('user_id', profile.id);

        if (linksError) throw linksError;

        // Get appearance settings
        const { data: appearance, error: appearanceError } = await supabase
          .from('appearance_settings')
          .select('*')
          .eq('user_id', profile.id);

        if (appearanceError && appearanceError.code !== 'PGRST116') {
          throw appearanceError;
        }

        setData({
          profile_id: profile.id,
          links_count: links?.length || 0,
          links: links || [],
          appearance: appearance?.[0] || null,
          tables: {
            has_links_table: !!links,
            has_appearance_table: !!appearance
          }
        });
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <pre className="bg-red-50 p-4 rounded">{error}</pre>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Data Check</h1>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">Profile ID</h2>
      <pre className="bg-gray-50 p-4 rounded">{data.profile_id}</pre>

      <h2 className="text-xl font-semibold mt-6 mb-2">Links ({data.links_count})</h2>
      <pre className="bg-gray-50 p-4 rounded">{JSON.stringify(data.links, null, 2)}</pre>

      <h2 className="text-xl font-semibold mt-6 mb-2">Appearance Settings</h2>
      <pre className="bg-gray-50 p-4 rounded">{JSON.stringify(data.appearance, null, 2)}</pre>

      <h2 className="text-xl font-semibold mt-6 mb-2">Table Check</h2>
      <pre className="bg-gray-50 p-4 rounded">{JSON.stringify(data.tables, null, 2)}</pre>
    </div>
  );
}
