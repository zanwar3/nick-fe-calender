<template>
  <section class="page">
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Event Calendar</h2>
          <div class="card-actions">
            <nuxt-link to="/" class="btn btn-secondary">Home</nuxt-link>
            <nuxt-link to="/timeline" class="btn btn-secondary">TimeLine</nuxt-link>
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
            <button @click="addSampleEvent" class="btn btn-success">Add Sample Event</button>
            <button @click="clearEvents" class="btn btn-danger">Clear Events</button>
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
          <div v-if="lastAction" class="status-action">{{ lastAction }}</div>
        </div>

        <div class="calendar-wrap">
          <div class="calendar-container">
            <EventCalendar
              :options="calendarOptions"
              :addEvent="true"
              @add-event="onAddEvent"
              @event-click="onEventClick"
            />
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
  components: { EventCalendar },

  data() {
    return {
      currentView: 'dayGridMonth',
      currentDate: new Date(),
      lastAction: '',
      events: [
        {
          id: '1',
          title: 'Meeting with Team',
          start: new Date(Date.now() + 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 26 * 60 * 60 * 1000),
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          extendedProps: { description: 'Weekly team standup meeting' }
        },
        {
          id: '2',
          title: 'Project Deadline',
          start: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          allDay: true,
          backgroundColor: '#ef4444',
          textColor: '#ffffff'
        },
        {
          id: '3',
          title: 'Client Presentation',
          start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
          end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
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
        editable: true,
        selectable: true,
        eventStartEditable: true,
        eventDurationEditable: true,
        dragScroll: true,
        headerToolbar: { start: 'prev,next today', center: 'title', end: '' },
        dayMaxEvents: 3,
        moreLinkClick: 'popover',
        slotMinTime: '06:00',
        slotMaxTime: '22:00',
        eventDisplay: 'block',
        displayEventTime: true,
        displayEventEnd: true,
        eventContent: (info) => ({
          html: `
            <div class="fc-event-time">${info.timeText || ''}</div>
            <div class="fc-event-title" title="${info.event.title}">${info.event.title}</div>
          `
        }),
        eventDrop: (info) => {
          this.lastAction = `Moved event: ${info.event.title} to ${info.event.start.toLocaleDateString()}`
        },
        eventResize: (info) => {
          this.lastAction = `Resized event: ${info.event.title}`
        }
      }
    }
  },

  methods: {
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
      const titles = ['Team Meeting', 'Project Review', 'Client Call', 'Code Review', 'Design Session', 'Sprint Planning', 'Lunch Break', 'Training Session']
      const randomTitle = titles[Math.floor(Math.random() * titles.length)]
      const randomStart = new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000)
      const randomEnd = new Date(randomStart.getTime() + (1 + Math.random() * 3) * 60 * 60 * 1000)
      this.addEvent({ title: randomTitle, start: randomStart, end: randomEnd })
    },

    clearEvents() {
      this.events = []
      this.lastAction = 'Cleared all events'
    },

    getRandomColor() {
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']
      return colors[Math.floor(Math.random() * colors.length)]
    },

    onAddEvent(info) {
      const title = prompt('Enter event title:')
      if (title) {
        this.addEvent({ title, start: info.date || info.start, end: info.end, allDay: info.allDay })
      }
    },

    onEventClick(info) {
      alert(`Event: ${info.event.title}\nStart: ${info.event.start}\nEnd: ${info.event.end || 'No end time'}`)
      this.lastAction = `Clicked event: ${info.event.title}`
    }
  }
}
</script>

<style scoped>
/* page, container, card, header, toolbar, buttons, status, calendar-wrap as before */
.page { min-height:100vh; background:linear-gradient(180deg,#f7f9fc 0%,#fff 100%); padding:24px 0; }
.container { max-width:1200px; margin:0 auto; padding:0 24px; }
.card { background:#fff; border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 10px 30px rgba(17,24,39,0.06); overflow:hidden; }
.card-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid #eef2f7; background:#fafbfc; }
.card-title { font-size:20px; font-weight:700; color:#111827; }
.card-actions { display:flex; gap:8px; }

.toolbar { display:flex; justify-content:space-between; align-items:center; padding:16px 24px; background:#fbfdff; border-bottom:1px solid #f0f3f8; flex-wrap:wrap; gap:16px; }
.segmented { display:inline-flex; background:#fff; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,0.05); }
.segmented-btn { padding:10px 14px; font-size:14px; color:#374151; background:#fff; border:none; cursor:pointer; transition:0.2s; }
.segmented-btn + .segmented-btn { border-left:1px solid #e5e7eb; }
.segmented-btn:hover { background:#f3f4f6; }
.segmented-btn.is-active { background:#1d4ed8; color:#fff; }
.toolbar-actions { display:flex; gap:10px; }
.btn { display:inline-flex; align-items:center; justify-content:center; padding:10px 16px; border-radius:8px; font-weight:600; border:1px solid transparent; cursor:pointer; transition:0.2s; }
.btn:active { transform:translateY(1px); }
.btn-secondary { background:#fff; color:#111827; border-color:#e5e7eb; }
.btn-secondary:hover { background:#f3f4f6; }
.btn-success { background:#10b981; color:#fff; box-shadow:0 6px 16px rgba(16,185,129,0.25); }
.btn-success:hover { background:#0ea371; }
.btn-danger { background:#ef4444; color:#fff; box-shadow:0 6px 16px rgba(239,68,68,0.25); }
.btn-danger:hover { background:#dc2626; }

.status { padding:14px 24px; background:#f9fbff; border-bottom:1px solid #f0f3f8; display:grid; row-gap:6px; }
.status-line { display:flex; flex-wrap:wrap; align-items:center; gap:10px; font-size:14px; color:#1f2937; }
.dot { width:4px; height:4px; background:#d1d5db; border-radius:999px; display:inline-block; }
.status-action { font-size:13px; color:#065f46; }

.calendar-wrap { padding:16px; }
.calendar-container { min-height:660px; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; background:#fff; }

:deep(.ec) { font-family:inherit; }
:deep(.ec-toolbar) { background:#f8fafc; border-bottom:1px solid #e2e8f0; padding:1rem; }
:deep(.ec-button) { background:#fff; border:1px solid #d1d5db; color:#374151; padding:0.5rem 1rem; border-radius:0.375rem; font-weight:500; transition:all 0.2s; }
:deep(.ec-button:hover) { background:#f3f4f6; border-color:#9ca3af; }
:deep(.ec-button.ec-active) { background:#3b82f6; border-color:#3b82f6; color:#fff; }
:deep(.ec-event) { border-radius:0.25rem; font-weight:500; cursor:pointer; transition:opacity 0.2s; }
:deep(.ec-event:hover) { opacity:0.8; }
:deep(.ec-day-today) { background-color: rgba(59,130,246,0.08); }
:deep(.ec-day-head) { font-weight:600; color:#374151; background-color:#f9fafb; }

@media(max-width:640px){ .card-header{padding:16px} .toolbar{padding:12px 16px} .status{padding:12px 16px} .calendar-wrap{padding:12px} }
</style>
