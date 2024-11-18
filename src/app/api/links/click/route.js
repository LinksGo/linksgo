'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { linkId, isOneTime } = await request.json()
    if (!linkId) {
      return Response.json({ error: 'Link ID is required' }, { status: 400 })
    }

    // TODO: Update click count in database
    // For now, we're just returning success since we're using client-side state
    // When implementing database, also handle one-time link deactivation here
    return Response.json({ 
      success: true,
      deactivated: isOneTime // Let the client know if the link was deactivated
    })
  } catch (error) {
    console.error('Error incrementing link clicks:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
