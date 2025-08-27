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
    } 
  },
  async mounted() {
    if (process.client) {
      // Wait for next tick and create calendar asynchronously
      await this.$nextTick()
      try {
        this._ec = await this.$ecCreate(this.$refs.ec, [], this.options)
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
        }
      }
    }
  }
}
</script>
<style scoped>
/* Custom calendar styling can go here */
</style>