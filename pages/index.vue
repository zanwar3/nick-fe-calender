<template>
  <section class="hero">
    <div class="container">
      <div class="content">
        <h1 class="title">Welcome</h1>
        <p class="subtitle">Manage and explore your events with a clean, focused interface.</p>

        <div class="actions">
          <nuxt-link to="/calendar" class="btn btn-primary">Open Calendar</nuxt-link>
          <nuxt-link to="/timeline" class="btn btn-secondary">TimeLine View</nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%);
}

.container {
  width: 100%;
  max-width: 1080px;
  padding: 0 24px;
  margin: 0 auto;
}

.content {
  text-align: center;
}

.title {
  font-size: 40px;
  line-height: 1.2;
  color: #1f2937;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 28px;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.08s ease, box-shadow 0.2s ease, background-color 0.2s ease, color 0.2s ease;
  border: 1px solid transparent;
}

.btn:active {
  transform: translateY(1px);
}

.btn-primary {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  background: #ffffff;
  color: #1f2937;
  border-color: #e5e7eb;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

@media (min-width: 768px) {
  .title { font-size: 48px; }
  .subtitle { font-size: 18px; }
}
</style>
