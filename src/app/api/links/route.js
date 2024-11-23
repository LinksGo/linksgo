import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET all links for the authenticated user
export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: links, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', session.user.id)
      .order('position')

    if (error) throw error

    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST a new link
export async function POST(request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check current number of links
    const { count, error: countError } = await supabase
      .from('links')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)

    if (countError) throw countError

    if (count >= 5) {
      return NextResponse.json({ 
        error: 'You have reached the maximum limit of 5 links. Please delete some links before adding more.',
        code: 'LINK_LIMIT_EXCEEDED'
      }, { status: 400 })
    }

    const json = await request.json()
    const { title, url, description = '', is_active = true } = json

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch (e) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    // Get the highest position for the user's links
    const { data: existingLinks, error: positionError } = await supabase
      .from('links')
      .select('position')
      .eq('user_id', session.user.id)
      .order('position', { ascending: false })
      .limit(1)

    if (positionError) throw positionError

    const newPosition = existingLinks?.[0]?.position ? existingLinks[0].position + 1 : 0

    const { data, error } = await supabase
      .from('links')
      .insert([
        {
          user_id: session.user.id,
          title,
          url,
          description,
          is_active,
          position: newPosition,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error inserting link:', error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to create link',
      details: error.details || ''
    }, { status: 500 })
  }
}

// PATCH to update a link
export async function PATCH(request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const { id, title, url, description, is_active, slug, expires_at, preview_image, position } = json

    if (!id) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('links')
      .update({
        title,
        url,
        description,
        is_active,
        slug,
        expires_at,
        preview_image,
        position,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating link:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE a link
export async function DELETE(request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) throw sessionError
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('links')
      .delete()
      .match({ id, user_id: session.user.id })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting link:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
