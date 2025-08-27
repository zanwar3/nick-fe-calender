<template>
  <div ref="ec"></div>
</template>
<script>
export default {
  name: 'EventCalendar',
  props: { 
    options: { 
      type: Object, 
      required: true 
    },
    // If true, emit add-event on date/select. If function, call it with info
    addEvent: {
      type: [Boolean, Function],
      default: false
    },
    // Optional direct callbacks. If provided, they will be called on events
    onEventClick: { type: Function, default: null },
    onDateClick: { type: Function, default: null },
    onSelect: { type: Function, default: null }
  },
  async mounted() {
    if (process.client) {
      // Wait for next tick and create calendar asynchronously
      await this.$nextTick()
      try {
        this._ec = await this.$ecCreate(this.$refs.ec, [], this.options)
        this.attachHandlers()
      } catch (error) {
        console.error('Failed to create EventCalendar:', error)
      }
    }
  },
  beforeDestroy() {
    if (this._ec && process.client) {
      this.$ecDestroy(this._ec)
    }
  },
  watch: {
    options: {
      deep: true,
      handler(newOptions) {
        if (this._ec && newOptions && process.client) {
          // Update calendar options dynamically
          if (newOptions.view) {
            this._ec.setOption('view', newOptions.view)
          }
          if (newOptions.date) {
            this._ec.setOption('date', newOptions.date)
          }
          if (newOptions.events) {
            this._ec.setOption('events', newOptions.events)
          }
          // Re-attach handlers only if parent hasn't provided them
          this.attachHandlers()
        }
      }
    },
    addEvent() { this.attachHandlers() },
    onEventClick() { this.attachHandlers() },
    onDateClick() { this.attachHandlers() },
    onSelect() { this.attachHandlers() }
  },
  methods: {
    attachHandlers() {
      if (!this._ec || !process.client) return
      const parentProvidedEventClick = this.options && typeof this.options.eventClick === 'function'
      const parentProvidedDateClick = this.options && typeof this.options.dateClick === 'function'
      const parentProvidedSelect = this.options && typeof this.options.select === 'function'

      if (!parentProvidedEventClick) {
        this._ec.setOption('eventClick', (info) => {
          if (typeof this.onEventClick === 'function') this.onEventClick(info)
          this.$emit('event-click', info)
        })
      }

      if (!parentProvidedDateClick) {
        this._ec.setOption('dateClick', (info) => {
          // Delegate to explicit handler if provided
          if (typeof this.onDateClick === 'function') this.onDateClick(info)
          // addEvent behavior: function wins, boolean emits
          if (typeof this.addEvent === 'function') {
            this.addEvent(info)
          } else if (this.addEvent === true) {
            this.$emit('add-event', info)
          }
          this.$emit('date-click', info)
        })
      }

      if (!parentProvidedSelect) {
        this._ec.setOption('select', (info) => {
          if (typeof this.onSelect === 'function') this.onSelect(info)
          if (typeof this.addEvent === 'function') {
            this.addEvent(info)
          } else if (this.addEvent === true) {
            this.$emit('add-event', info)
          }
          this.$emit('date-select', info)
        })
      }
    }
  }
}
</script>
<style scoped>
/* Custom calendar styling can go here */
</style>