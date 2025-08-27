<template>
    <section class="page">
      <div class="container">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Event Calendar</h2>
            <div class="card-actions">
              <nuxt-link to="/" class="btn btn-secondary">Home</nuxt-link>
            </div>
          </div>

          <div class="toolbar">
            <div class="segmented" role="group" aria-label="View switcher">
              <button 
                @click="changeView('dayGridMonth')"
                :class="['segmented-btn', currentView === 'dayGridMonth' && 'is-active']">
                Month
              </button>
              <button 
                @click="changeView('timeGridWeek')"
                :class="['segmented-btn', currentView === 'timeGridWeek' && 'is-active']">
                Week
              </button>
              <button 
                @click="changeView('timeGridDay')"
                :class="['segmented-btn', currentView === 'timeGridDay' && 'is-active']">
                Day
              </button>
              <button 
                @click="changeView('listWeek')"
                :class="['segmented-btn', currentView === 'listWeek' && 'is-active']">
                List
              </button>
            </div>

            <div class="toolbar-actions">
              <button 
                @click="addSampleEvent"
                class="btn btn-success">
                Add Sample Event
              </button>
              <button 
                @click="clearEvents"
                class="btn btn-danger">
                Clear Events
              </button>
            </div>
          </div>

          <div class="status">
            <div class="status-line">
              <span><strong>Events:</strong> {{ events.length }}</span>
              <span class="dot"></span>
              <span><strong>View:</strong> {{ currentView }}</span>
              <span class="dot"></span>
              <span><strong>Date:</strong> {{ currentDate.toLocaleDateString() }}</span>
            </div>
            <div v-if="lastAction" class="status-action">
              {{ lastAction }}
            </div>
          </div>

          <div class="calendar-wrap">
            <div class="calendar-container">
              <EventCalendar :options="calendarOptions" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  <script>
    import EventCalendar from '~/components/EventCalendar.vue'
    export default {
      layout: 'default',
      name: 'MainDashboard',
      // middleware: 'authenticated',
      components: {
        EventCalendar
      },
      data() {
        return {
          currentView: 'dayGridMonth',
          currentDate: new Date(),
          lastAction: '',
          events: [
            {
              id: '1',
              title: 'Meeting with Team',
              start: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
              end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // Tomorrow + 2 hours
              backgroundColor: '#3b82f6',
              textColor: '#ffffff',
              extendedProps: {
                description: 'Weekly team standup meeting'
              }
            },
            {
              id: '2',
              title: 'Project Deadline',
              start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
              allDay: true,
              backgroundColor: '#ef4444',
              textColor: '#ffffff'
            },
            {
              id: '3',
              title: 'Client Presentation',
              start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // Next week, 2 PM
              end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // Next week, 4 PM
              backgroundColor: '#10b981',
              textColor: '#ffffff'
            }
          ]
        }
      },
      computed: {
        calendarOptions() {
          return {
            view: this.currentView,
            date: this.currentDate,
            events: this.events,
            
            // Calendar Features
            editable: true,
            selectable: true,
            eventStartEditable: true,
            eventDurationEditable: true,
            dragScroll: true,
            
            // Header toolbar
            headerToolbar: {
              start: 'prev,next today',
              center: 'title', 
              end: ''
            },
            // Event handlers
            eventClick: (info) => {
              this.lastAction = `Clicked event: ${info.event.title}`
              console.log('Event clicked:', info.event)
              
              // Show event details
              alert(`Event: ${info.event.title}\nStart: ${info.event.start}\nEnd: ${info.event.end || 'No end time'}`)
            },
            eventDrop: (info) => {
              this.lastAction = `Moved event: ${info.event.title} to ${info.event.start.toLocaleDateString()}`
              console.log('Event dropped:', info.event)
            },
            eventResize: (info) => {
              this.lastAction = `Resized event: ${info.event.title}`
              console.log('Event resized:', info.event)
            },
            dateClick: (info) => {
              this.lastAction = `Clicked date: ${info.date.toLocaleDateString()}`
              console.log('Date clicked:', info.date)
              
              // Ask user to create event
              const title = prompt('Enter event title:')
              if (title) {
                this.addEvent({
                  title: title,
                  start: info.date,
                  allDay: info.allDay
                })
              }
            },
            select: (info) => {
              this.lastAction = `Selected date range: ${info.start.toLocaleDateString()} - ${info.end.toLocaleDateString()}`
              console.log('Date range selected:', info)
              
              // Ask user to create event
              const title = prompt('Enter event title for selected period:')
              if (title) {
                this.addEvent({
                  title: title,
                  start: info.start,
                  end: info.end,
                  allDay: info.allDay
                })
              }
            },
            // Styling
            dayMaxEvents: 3,
            moreLinkClick: 'popover',
            
            // Time settings
            slotMinTime: '06:00',
            slotMaxTime: '22:00',
            
            // Event appearance
            eventDisplay: 'block',
            displayEventTime: true,
            displayEventEnd: true,
            // Custom event content
            eventContent: (info) => {
              return {
                html: `
                  <div class="fc-event-time">${info.timeText || ''}</div>
                  <div class="fc-event-title" title="${info.event.title}">
                    ${info.event.title}
                  </div>
                `
              }
            }
          }
        }
      },
      mounted() {
        // this.setPreloader(false)
      },
      beforeDestroy() {
      },
      methods: {
        // ...mapMutations({
        //   setPreloader: 'management/setPreloader',
        // }),
        initializeCalendar() {
          this.calendar = createCalendar({
            target: this.$refs.calendarContainer,
            props: {
              options: {
                view: this.currentView,
                date: this.currentDate,
                events: this.events,
                
                // Calendar Features
                editable: true,
                selectable: true,
                eventStartEditable: true,
                eventDurationEditable: true,
                dragScroll: true,
                
                // Header toolbar
                headerToolbar: {
                  start: 'prev,next today',
                  center: 'title', 
                  end: ''
                },
                // Event handlers
                eventClick: (info) => {
                  this.lastAction = `Clicked event: ${info.event.title}`
                  console.log('Event clicked:', info.event)
                  
                  // Show event details
                  alert(`Event: ${info.event.title}\nStart: ${info.event.start}\nEnd: ${info.event.end || 'No end time'}`)
                },
                eventDrop: (info) => {
                  this.lastAction = `Moved event: ${info.event.title} to ${info.event.start.toLocaleDateString()}`
                  console.log('Event dropped:', info.event)
                },
                eventResize: (info) => {
                  this.lastAction = `Resized event: ${info.event.title}`
                  console.log('Event resized:', info.event)
                },
                dateClick: (info) => {
                  this.lastAction = `Clicked date: ${info.date.toLocaleDateString()}`
                  console.log('Date clicked:', info.date)
                  
                  // Ask user to create event
                  const title = prompt('Enter event title:')
                  if (title) {
                    this.addEvent({
                      title: title,
                      start: info.date,
                      allDay: info.allDay
                    })
                  }
                },
                select: (info) => {
                  this.lastAction = `Selected date range: ${info.start.toLocaleDateString()} - ${info.end.toLocaleDateString()}`
                  console.log('Date range selected:', info)
                  
                  // Ask user to create event
                  const title = prompt('Enter event title for selected period:')
                  if (title) {
                    this.addEvent({
                      title: title,
                      start: info.start,
                      end: info.end,
                      allDay: info.allDay
                    })
                  }
                },
                // Styling
                dayMaxEvents: 3,
                moreLinkClick: 'popover',
                
                // Time settings
                slotMinTime: '06:00',
                slotMaxTime: '22:00',
                
                // Event appearance
                eventDisplay: 'block',
                displayEventTime: true,
                displayEventEnd: true,
                // Custom event content
                eventContent: (info) => {
                  return {
                    html: `
                      <div class="fc-event-time">${info.timeText || ''}</div>
                      <div class="fc-event-title" title="${info.event.title}">
                        ${info.event.title}
                      </div>
                    `
                  }
                }
              }
            }
          })
        },
        changeView(viewName) {
          this.currentView = viewName
          this.lastAction = `Changed view to: ${viewName}`
        },
        addEvent(eventData) {
          const newEvent = {
            id: Date.now().toString(),
            title: eventData.title,
            start: eventData.start,
            end: eventData.end,
            allDay: eventData.allDay || false,
            backgroundColor: this.getRandomColor(),
            textColor: '#ffffff',
            ...eventData
          }
          this.events.push(newEvent)
          this.lastAction = `Added event: ${newEvent.title}`
        },
        addSampleEvent() {
          const titles = [
            'Team Meeting', 'Project Review', 'Client Call', 'Code Review', 
            'Design Session', 'Sprint Planning', 'Lunch Break', 'Training Session'
          ]
          
          const randomTitle = titles[Math.floor(Math.random() * titles.length)]
          const randomStart = new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000) // Next 2 weeks
          const randomEnd = new Date(randomStart.getTime() + (1 + Math.random() * 3) * 60 * 60 * 1000) // 1-4 hours later
          this.addEvent({
            title: randomTitle,
            start: randomStart,
            end: randomEnd
          })
        },
        clearEvents() {
          this.events = []
          this.lastAction = 'Cleared all events'
        },
        getRandomColor() {
          const colors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
            '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
          ]
          return colors[Math.floor(Math.random() * colors.length)]
        }
      }
    }
  </script>
  <style scoped>
    .page {
      min-height: 100vh;
      background: linear-gradient(180deg, #f7f9fc 0%, #ffffff 100%);
      padding: 24px 0;
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(17, 24, 39, 0.06);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid #eef2f7;
      background: #fafbfc;
    }

    .card-title {
      font-size: 20px;
      color: #111827;
      font-weight: 700;
    }

    .card-actions { display: flex; gap: 8px; }

    .toolbar {
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      background: #fbfdff;
      border-bottom: 1px solid #f0f3f8;
      flex-wrap: wrap;
    }

    .segmented {
      display: inline-flex;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
    }

    .segmented-btn {
      padding: 10px 14px;
      font-size: 14px;
      color: #374151;
      background: #ffffff;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .segmented-btn + .segmented-btn { border-left: 1px solid #e5e7eb; }
    .segmented-btn:hover { background: #f3f4f6; }
    .segmented-btn.is-active { background: #1d4ed8; color: #ffffff; }

    .toolbar-actions { display: flex; gap: 10px; }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      border: 1px solid transparent;
      cursor: pointer;
      transition: transform 0.08s ease, box-shadow 0.2s ease, background 0.2s ease;
    }

    .btn:active { transform: translateY(1px); }
    .btn-secondary { background: #ffffff; color: #111827; border-color: #e5e7eb; }
    .btn-secondary:hover { background: #f3f4f6; }
    .btn-success { background: #10b981; color: #ffffff; box-shadow: 0 6px 16px rgba(16, 185, 129, 0.25); }
    .btn-success:hover { background: #0ea371; }
    .btn-danger { background: #ef4444; color: #ffffff; box-shadow: 0 6px 16px rgba(239, 68, 68, 0.25); }
    .btn-danger:hover { background: #dc2626; }

    .status {
      padding: 14px 24px;
      background: #f9fbff;
      border-bottom: 1px solid #f0f3f8;
      display: grid;
      row-gap: 6px;
    }

    .status-line {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #1f2937;
      font-size: 14px;
      flex-wrap: wrap;
    }

    .dot {
      width: 4px;
      height: 4px;
      background: #d1d5db;
      border-radius: 999px;
      display: inline-block;
    }

    .status-action { font-size: 13px; color: #065f46; }

    .calendar-wrap { padding: 16px; }
    .calendar-container {
      min-height: 660px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
      background: #ffffff;
    }

    /* Custom calendar styling */
    :deep(.ec) { font-family: inherit; }
    :deep(.ec-toolbar) {
      background-color: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 1rem;
    }
    :deep(.ec-button) {
      background-color: #ffffff;
      border: 1px solid #d1d5db;
      color: #374151;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    :deep(.ec-button:hover) { background-color: #f3f4f6; border-color: #9ca3af; }
    :deep(.ec-button.ec-active) { background-color: #3b82f6; border-color: #3b82f6; color: #ffffff; }
    :deep(.ec-event) { border-radius: 0.25rem; font-weight: 500; cursor: pointer; transition: opacity 0.2s; }
    :deep(.ec-event:hover) { opacity: 0.8; }
    :deep(.ec-day-today) { background-color: rgba(59, 130, 246, 0.08); }
    :deep(.ec-day-head) { font-weight: 600; color: #374151; background-color: #f9fafb; }

    @media (max-width: 640px) {
      .card-header { padding: 16px; }
      .toolbar { padding: 12px 16px; }
      .status { padding: 12px 16px; }
      .calendar-wrap { padding: 12px; }
    }
  </style>