<template>
  <div ref="ec" class="event-viewer"></div>
</template>

<script>
export default {
  name: "EventViewer",
  props: {
    mode: {
      type: String,
      default: "calendar", // "calendar" or "timeline"
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    events: {
      type: Array,
      default: () => [],
    },
    addEvent: {
      type: [Boolean, Function],
      default: false,
    },
    onEventClick: { type: Function, default: null },
    onDateClick: { type: Function, default: null },
    onSelect: { type: Function, default: null },
  },
  data() {
    return {
      _ec: null,
    };
  },
  async mounted() {
    if (!process.client) return;
    await this.$nextTick();
    try {
      this._ec = await this.$ecCreate(this.$refs.ec, [], {
        view: this.mode === "calendar" ? this.options.view || "dayGridMonth" : "resourceTimelineDay",
        date: this.options.date || new Date(),
        resources: this.mode === "timeline" ? this.options.resources || [] : undefined,
        events: this.events,
        selectable: true,
        editable: this.options.editable ?? true,
      });
      this.attachHandlers();
    } catch (e) {
      console.error("Failed to create EventViewer:", e);
    }
  },
  watch: {
    events: {
      handler(newEvents) {
        if (this._ec) this._ec.setOption("events", [...newEvents]);
      },
      deep: true,
    },
    options: {
      deep: true,
      handler(newOpts) {
        if (!this._ec) return;
        Object.keys(newOpts).forEach(key => {
          this._ec.setOption(key, newOpts[key]);
        });
        this.attachHandlers();
      },
    },
  },
  beforeDestroy() {
    if (this._ec) this.$ecDestroy(this._ec);
  },
  methods: {
    attachHandlers() {
      if (!this._ec) return;

      // Event click
      this._ec.setOption("eventClick", (info) => {
        if (typeof this.onEventClick === "function") this.onEventClick(info);
        this.$emit("event-click", info);
      });

      // Date click
      this._ec.setOption("dateClick", (info) => {
        if (typeof this.onDateClick === "function") this.onDateClick(info);
        if (typeof this.addEvent === "function") this.addEvent(info);
        else if (this.addEvent === true) this.$emit("add-event", info);
        this.$emit("date-click", info);
      });

      // Select
      this._ec.setOption("select", (info) => {
        if (typeof this.onSelect === "function") this.onSelect(info);
        if (typeof this.addEvent === "function") this.addEvent(info);
        else if (this.addEvent === true) this.$emit("add-event", info);
        this.$emit("date-select", info);
      });
    },
  },
};
</script>

<style scoped>
.event-viewer {
  min-height: 400px;
  width: 100%;
}
</style>
