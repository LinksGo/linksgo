import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Initialize Supabase client
const supabase = createClientComponentClient()

// Links operations
export const getLinks = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user.id)
    .order('position')

  if (error) throw error
  return data
}

export const createLink = async (linkData) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get the highest position
  const { data: existingLinks } = await supabase
    .from('links')
    .select('position')
    .eq('user_id', user.id)
    .order('position', { ascending: false })
    .limit(1)

  const newPosition = existingLinks?.[0]?.position ? existingLinks[0].position + 1 : 0

  const { data, error } = await supabase
    .from('links')
    .insert([{
      ...linkData,
      user_id: user.id,
      position: newPosition,
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateLink = async (id, updates) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('links')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteLink = async (id) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
  return true
}

export const reorderLinks = async (links) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const updates = links.map((link, index) => ({
    id: link.id,
    position: index,
  }))

  const { error } = await supabase.rpc('batch_update_link_positions', {
    updates: updates
  })

  if (error) throw error
  return true
}

// Appearance settings operations
export const getAppearanceSettings = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('appearance_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') throw error

  // Return defaults if no settings exist
  if (!data) {
    return {
      theme: 'light',
      primary_color: '#000000',
      background_color: '#ffffff',
      text_color: '#000000',
      font_family: 'Inter',
    }
  }

  return data
}

export const updateAppearanceSettings = async (settings) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: existingSettings } = await supabase
    .from('appearance_settings')
    .select('id')
    .eq('user_id', user.id)
    .single()

  let result
  if (existingSettings) {
    result = await supabase
      .from('appearance_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single()
  } else {
    result = await supabase
      .from('appearance_settings')
      .insert([{
        user_id: user.id,
        ...settings,
      }])
      .select()
      .single()
  }

  if (result.error) throw result.error
  return result.data
}

// Profile operations
export const getProfile = async (username) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      links!inner(*)
    `)
    .eq('username', username)
    .single()

  if (error) throw error
  return data
}

export const updateProfile = async (updates) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Analytics operations
export const getAnalyticsSummary = async (timeframe = '7d') => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const now = new Date()
  const startDate = new Date()
  
  switch (timeframe) {
    case '24h':
      startDate.setHours(startDate.getHours() - 24)
      break
    case '7d':
      startDate.setDate(startDate.getDate() - 7)
      break
    case '30d':
      startDate.setDate(startDate.getDate() - 30)
      break
    case '90d':
      startDate.setDate(startDate.getDate() - 90)
      break
  }

  const [pageViews, linkClicks] = await Promise.all([
    supabase
      .from('page_views')
      .select('created_at, device_type, browser, country')
      .eq('profile_id', user.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString()),
    supabase
      .from('link_clicks')
      .select(`
        created_at,
        device_type,
        browser,
        country,
        links!inner(title)
      `)
      .eq('links.user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString())
  ])

  if (pageViews.error) throw pageViews.error
  if (linkClicks.error) throw linkClicks.error

  return {
    pageViews: pageViews.data,
    linkClicks: linkClicks.data,
    summary: {
      total_views: pageViews.data.length,
      total_clicks: linkClicks.data.length,
      unique_visitors: new Set(pageViews.data.map(pv => pv.visitor_id)).size,
      top_countries: Object.entries(
        pageViews.data.reduce((acc, pv) => {
          acc[pv.country] = (acc[pv.country] || 0) + 1
          return acc
        }, {})
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      top_browsers: Object.entries(
        pageViews.data.reduce((acc, pv) => {
          acc[pv.browser] = (acc[pv.browser] || 0) + 1
          return acc
        }, {})
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
    }
  }
}
