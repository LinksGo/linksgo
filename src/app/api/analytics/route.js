import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Track page view
export async function POST(request) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const json = await request.json()
    const {
      profile_id,
      visitor_id,
      user_agent,
      referrer,
      device_type,
      browser,
      os,
      country,
      city,
    } = json

    // Record page view
    const { error: pageViewError } = await supabase
      .from('page_views')
      .insert([{
        profile_id,
        visitor_id,
        user_agent,
        referrer,
        device_type,
        browser,
        os,
        country,
        city,
      }])

    if (pageViewError) throw pageViewError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking page view:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Track link click
export async function PUT(request) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const json = await request.json()
    const {
      link_id,
      visitor_id,
      user_agent,
      referrer,
      device_type,
      browser,
      os,
      country,
      city,
    } = json

    // Record link click
    const { error: clickError } = await supabase
      .from('link_clicks')
      .insert([{
        link_id,
        visitor_id,
        user_agent,
        referrer,
        device_type,
        browser,
        os,
        country,
        city,
      }])

    if (clickError) throw clickError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking link click:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Get analytics data
export async function GET(request) {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { searchParams } = new URL(request.url)
    const profile_id = searchParams.get('profile_id')
    const timeframe = searchParams.get('timeframe') || '7d' // Default to 7 days
    
    if (!profile_id) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
    }

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
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
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }

    // Get page views
    const { data: pageViews, error: pageViewsError } = await supabase
      .from('page_views')
      .select('*')
      .eq('profile_id', profile_id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString())

    if (pageViewsError) throw pageViewsError

    // Get link clicks
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('id')
      .eq('user_id', profile_id)

    if (linksError) throw linksError

    const linkIds = links.map(link => link.id)
    
    const { data: linkClicks, error: clicksError } = await supabase
      .from('link_clicks')
      .select('*')
      .in('link_id', linkIds)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString())

    if (clicksError) throw clicksError

    // Process analytics data
    const analytics = {
      pageViews: {
        total: pageViews.length,
        byDevice: countBy(pageViews, 'device_type'),
        byCountry: countBy(pageViews, 'country'),
        byBrowser: countBy(pageViews, 'browser'),
        byOS: countBy(pageViews, 'os'),
      },
      linkClicks: {
        total: linkClicks.length,
        byDevice: countBy(linkClicks, 'device_type'),
        byCountry: countBy(linkClicks, 'country'),
        byLink: countBy(linkClicks, 'link_id'),
      },
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Helper function to count occurrences
function countBy(array, key) {
  return array.reduce((acc, item) => {
    const value = item[key]
    if (value) {
      acc[value] = (acc[value] || 0) + 1
    }
    return acc
  }, {})
}
