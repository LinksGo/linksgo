import UAParser from 'ua-parser-js'

// Generate a unique visitor ID
export const generateVisitorId = () => {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${randomStr}`
}

// Get visitor info from user agent
export const getVisitorInfo = (userAgent) => {
  const parser = new UAParser(userAgent)
  const device = parser.getDevice()
  const browser = parser.getBrowser()
  const os = parser.getOS()

  return {
    device_type: device.type || 'desktop',
    browser: browser.name || 'unknown',
    os: os.name || 'unknown',
    user_agent: userAgent,
  }
}

// Track page view
export const trackPageView = async (profileId) => {
  try {
    let visitorId = localStorage.getItem('visitor_id')
    if (!visitorId) {
      visitorId = generateVisitorId()
      localStorage.setItem('visitor_id', visitorId)
    }

    const visitorInfo = getVisitorInfo(navigator.userAgent)
    
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        profile_id: profileId,
        visitor_id: visitorId,
        referrer: document.referrer,
        ...visitorInfo,
        // Note: country and city would typically come from an IP geolocation service
        // For this example, we'll leave them undefined
      }),
    })
  } catch (error) {
    console.error('Failed to track page view:', error)
  }
}

// Track link click
export const trackLinkClick = async (linkId) => {
  try {
    let visitorId = localStorage.getItem('visitor_id')
    if (!visitorId) {
      visitorId = generateVisitorId()
      localStorage.setItem('visitor_id', visitorId)
    }

    const visitorInfo = getVisitorInfo(navigator.userAgent)
    
    await fetch('/api/analytics', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        link_id: linkId,
        visitor_id: visitorId,
        referrer: document.referrer,
        ...visitorInfo,
      }),
    })
  } catch (error) {
    console.error('Failed to track link click:', error)
  }
}

// Get analytics data
export const getAnalytics = async (timeframe = '7d') => {
  try {
    const response = await fetch(`/api/analytics?timeframe=${timeframe}`)
    if (!response.ok) {
      throw new Error('Failed to fetch analytics')
    }
    return await response.json()
  } catch (error) {
    console.error('Failed to get analytics:', error)
    return null
  }
}
