import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// GET appearance settings for the authenticated user
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('appearance_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows returned"

    // If no settings exist, return defaults
    if (!data) {
      return NextResponse.json({
        theme: 'light',
        primary_color: '#000000',
        background_color: '#ffffff',
        text_color: '#000000',
        font_family: 'Inter',
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST or update appearance settings
export async function POST(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const {
      theme,
      primary_color,
      background_color,
      text_color,
      font_family,
    } = json

    // Check if settings already exist
    const { data: existingSettings } = await supabase
      .from('appearance_settings')
      .select('id')
      .eq('user_id', user.id)
      .single()

    let result
    if (existingSettings) {
      // Update existing settings
      result = await supabase
        .from('appearance_settings')
        .update({
          theme,
          primary_color,
          background_color,
          text_color,
          font_family,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single()
    } else {
      // Create new settings
      result = await supabase
        .from('appearance_settings')
        .insert([{
          user_id: user.id,
          theme,
          primary_color,
          background_color,
          text_color,
          font_family,
        }])
        .select()
        .single()
    }

    if (result.error) throw result.error

    return NextResponse.json(result.data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
