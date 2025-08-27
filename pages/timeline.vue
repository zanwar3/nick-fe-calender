<template>
  <section class="page">
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Resource Timeline</h2>
          <div class="card-actions">
            <nuxt-link to="/" class="btn btn-secondary">Home</nuxt-link>
            <button class="btn btn-success" @click="addSampleTask">Add Task</button>
            <button class="btn btn-danger" @click="clearTasks">Clear Tasks</button>
          </div>
        </div>

        <div class="toolbar">
          <div class="segmented" role="group" aria-label="View switcher">
            <button
              @click="changeView('resourceTimelineDay')"
              :class="['segmented-btn', currentView === 'resourceTimelineDay' && 'is-active']">
              Day
            </button>
            <button
              @click="changeView('resourceTimelineWeek')"
              :class="['segmented-btn', currentView === 'resourceTimelineWeek' && 'is-active']">
              Week
            </button>
            <button
              @click="changeView('resourceTimelineMonth')"
              :class="['segmented-btn', currentView === 'resourceTimelineMonth' && 'is-active']">
              Month
            </button>
          </div>
        </div>

        <div class="status">
          <div class="status-line">
            <span><strong>Tasks:</strong> {{ tasks.length }}</span>
            <span class="dot"></span>
            <span><strong>View:</strong> {{ currentView }}</span>
            <span class="dot"></span>
            <span><strong>Date:</strong> {{ currentDate.toLocaleDateString() }}</span>
          </div>
          <div v-if="lastAction" class="status-action">{{ lastAction }}</div>
        </div>

        <div class="timeline-wrap">
          <div class="timeline-container">
            <EventViewer
              mode="timeline"
              :options="timelineOptions"
              :events="tasks"
              :addEvent="true"
              @add-event="onAddTask"
              @event-click="onTaskClick"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import EventViewer from '@/components/EventViewer.vue'

export default {
  name: 'ResourceTimelinePage',
  components: { EventViewer },

  data() {
    return {
      currentView: 'resourceTimelineDay',
      currentDate: new Date(),
      tasks: [
        { id: '1', title: 'Task A', start: new Date(), end: new Date(new Date().getTime() + 2*60*60*1000), resourceId: 'a', backgroundColor:'#3b82f6', textColor:'#fff' },
        { id: '2', title: 'Task B', start: new Date(new Date().getTime() + 3*60*60*1000), end: new Date(new Date().getTime() + 5*60*60*1000), resourceId: 'b', backgroundColor:'#10b981', textColor:'#fff' },
      ],
      lastAction: '',
    }
  },

  computed: {
    timelineOptions() {
      return {
        view: this.currentView,
        date: this.currentDate,
        resources: [
          { id: 'a', title: 'Resource A' },
          { id: 'b', title: 'Resource B' },
          { id: 'c', title: 'Resource C' },
          { id: "d", title: "Resource D" },
          { id: "e", title: "Resource E" },
          { id: "f", title: "Resource F" },
        ],
        editable: true,
        selectable: true,
        headerToolbar: { start: 'prev,next today', center: 'title', end: '' },
      }
    }
  },

  methods: {
    changeView(view) {
      this.currentView = view
      this.lastAction = `Changed view to: ${view}`
    },

    addSampleTask() {
      const newTask = {
        id: Date.now().toString(),
        title: `Task ${String.fromCharCode(65 + this.tasks.length)}`,
        start: new Date(),
        end: new Date(new Date().getTime() + 60*60*1000),
        resourceId: ['a','b','c'][Math.floor(Math.random()*3)],
        backgroundColor: ['#3b82f6','#10b981','#f59e0b'][Math.floor(Math.random()*3)],
        textColor:'#fff',
      }
      this.tasks.push(newTask)
      this.lastAction = `Added task: ${newTask.title}`
    },

    clearTasks() {
      this.tasks = []
      this.lastAction = 'Cleared all tasks'
    },

    onAddTask(info) {
      const title = prompt('Enter task title:')
      if (!title) return

      // Determine start and end
      const start = info.start || info.date || new Date()
      const end = info.end || new Date(start.getTime() + 60 * 60 * 1000) // 1 hour default if single click

      const newTask = {
        id: Date.now().toString(),
        title,
        start,
        end,
        resourceId: info.resource?.id || 'a',
        backgroundColor: '#3b82f6',
        textColor: '#fff',
      }

      this.tasks = [...this.tasks, newTask]
      this.lastAction = `Added task: ${newTask.title}`
    },



    onTaskClick(info) {
      alert(`Task: ${info.event.title}\nStart: ${info.event.start}\nEnd: ${info.event.end}`)
      this.lastAction = `Clicked task: ${info.event.title}`
    },
  },
}
</script>

<style scoped>
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

.btn { display:inline-flex; align-items:center; justify-content:center; padding:10px 16px; border-radius:8px; font-weight:600; border:1px solid transparent; cursor:pointer; transition:0.2s; }
.btn-success { background:#10b981; color:#fff; box-shadow:0 6px 16px rgba(16,185,129,0.25); }
.btn-success:hover { background:#0ea371; }
.btn-danger { background:#ef4444; color:#fff; box-shadow:0 6px 16px rgba(239,68,68,0.25); }
.btn-danger:hover { background:#dc2626; }

.status { padding:14px 24px; background:#f9fbff; border-bottom:1px solid #f0f3f8; display:grid; row-gap:6px; }
.status-line { display:flex; flex-wrap:wrap; align-items:center; gap:10px; font-size:14px; color:#1f2937; }
.dot { width:4px; height:4px; background:#d1d5db; border-radius:999px; display:inline-block; }
.status-action { font-size:13px; color:#065f46; }

.timeline-wrap { padding:16px; }
.timeline-container { min-height:660px; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; background:#fff; }

:deep(.ec) { font-family:inherit; }
:deep(.ec-toolbar) { background:#f8fafc; border-bottom:1px solid #e2e8f0; padding:1rem; }
:deep(.ec-button) { background:#fff; border:1px solid #d1d5db; color:#374151; padding:0.5rem 1rem; border-radius:0.375rem; font-weight:500; transition:all 0.2s; }
:deep(.ec-button:hover) { background:#f3f4f6; border-color:#9ca3af; }
:deep(.ec-button.ec-active) { background:#3b82f6; border-color:#3b82f6; color:#fff; }
:deep(.ec-event) { border-radius:0.25rem; font-weight:500; cursor:pointer; transition:opacity 0.2s; }
:deep(.ec-event:hover) { opacity:0.8; }
:deep(.ec-day-today) { background-color: rgba(59,130,246,0.08); }
:deep(.ec-day-head) { font-weight:600; color:#374151; background-color:#f9fafb; }

@media(max-width:640px){ .card-header{padding:16px} .toolbar{padding:12px 16px} .status{padding:12px 16px} .timeline-wrap{padding:12px} }
</style>

