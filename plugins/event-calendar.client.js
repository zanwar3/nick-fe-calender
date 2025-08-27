export default (_ctx, inject) => {
  let eventCalendarLoaded = false
  let eventCalendarPromise = null
  
  const loadEventCalendar = () => {
    if (eventCalendarPromise) return eventCalendarPromise
    
    // Check if already loaded
    if (typeof window !== 'undefined' && window.EventCalendar) {
      eventCalendarLoaded = true
      return Promise.resolve(window.EventCalendar)
    }
    
    eventCalendarPromise = new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(null)
        return
      }
      
      // Load CSS only when needed
      const css = document.createElement('link')
      css.rel = 'stylesheet'
      css.href = '/vendor/event-calendar/event-calendar.min.css'
      document.head.appendChild(css)
      
      // Load JS only when needed
      const script = document.createElement('script')
      script.src = '/vendor/event-calendar/event-calendar.min.js'
      script.async = true
      
      script.onload = () => {
        if (window.EventCalendar) {
          eventCalendarLoaded = true
          resolve(window.EventCalendar)
        } else {
          resolve(null)
        }
      }
      
      script.onerror = () => {
        resolve(null)
      }
      
      document.head.appendChild(script)
    })
    
    return eventCalendarPromise
  }
  
  // Load EventCalendar on-demand when component needs it
  inject('ecCreate', async (target, _plugins, options) => {
    const EventCalendar = await loadEventCalendar()
    if (EventCalendar) {
      return EventCalendar.create(target, options)
    }
    return null
  })
  
  inject('ecDestroy', (calendar) => {
    if (typeof window !== 'undefined' && window.EventCalendar && calendar) {
      return window.EventCalendar.destroy(calendar)
    }
  })
  
  // For on-demand version, plugins are already included
  inject('ecPlugins', {})
}