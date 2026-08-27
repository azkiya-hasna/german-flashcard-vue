<template>
  <div class="dashboard-wrap">
    <!-- Hero Level Header -->
    <section class="hero-section">
      <div class="hero-left">
        <span class="level-sub"> LEVEL {{ currentLevel }}</span>
        <h1 class="hero-title">
  {{ heroInfo.title }} 
  <span class="badge-de" style="font-size: 1.2em; vertical-align: middle;">🇩🇪</span>
</h1>
        <p class="hero-desc">{{ levelDescription }}</p>
      </div>
      <div class="hero-right">
        <span class="module-stat-text">{{ completedModulesCount }}/{{ decks.length }} modules complete</span>
      </div>
    </section>

    <!-- 3 Metrics Bar -->
    <section class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon-box icon-book">📖</div>
        <div class="metric-info">
          <h2>{{ totalMasteredCount }}</h2>
          <span class="metric-label">Words Mastered</span>
          <span class="metric-sub">of {{ totalWordsInLevel }} total</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon-box icon-target">🎯</div>
        <div class="metric-info">
          <h2>{{ completionPercent }}%</h2>
          <span class="metric-label">Quiz Completion</span>
          <span class="metric-sub">across all modules</span>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon-box icon-check">✅</div>
        <div class="metric-info">
          <h2>{{ completedModulesCount }}</h2>
          <span class="metric-label">Modules Done</span>
          <span class="metric-sub">of {{ decks.length }} modules</span>
        </div>
      </div>
    </section>

    <!-- Section Title -->
    <div class="section-divider">
      <h3>{{ currentLevel }} Modules <span class="count-tag">— {{ decks.length }} sets</span></h3>
    </div>

    <!-- Futuristic Chapter Grid -->
    <div class="modules-grid">
      <div 
        v-for="(deck, idx) in decks" 
        :key="deck.id"
        class="futuristic-card"
        :class="getFuturisticGradient(idx)"
        @click="$emit('selectChapter', deck)"
      >
        <div class="card-glass-shell">
          <!-- Top Inner Glass Pill / Header Container -->
          <div class="inner-glass-box">
            <span class="ch-sub-code">{{ deck.num }}</span>
            <h4 class="ch-title-txt">{{ deck.emoji || '📖' }} {{ deck.name }}</h4>
          </div>

          <!-- Bottom Progress and Stats Bar -->
          <div class="card-action-bottom">
            <div class="progress-meta-row">
              <div class="progress-track-neon">
                <div 
                  class="progress-bar-neon" 
                  :class="getNeonBarColor(deck)"
                  :style="{ width: `${getDeckProgressPercent(deck)}%` }"
                ></div>
              </div>
              <span class="ratio-indicator">{{ getMasteredCount(deck) }}/{{ deck.items.length }}</span>
            </div>

            <div class="status-badge-row">
              <span 
                class="futuristic-badge" 
                :class="isDeckComplete(deck) ? 'badge-success' : 'badge-progress'"
              >
                {{ getDeckBadgeText(deck) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentLevel: { type: String, required: true },
  levelDescription: { type: String, default: '' },
  decks: { type: Array, default: () => [] },
  memoryLedger: { type: Object, default: () => ({ masteredKeys: {}, quizScores: {} }) }
})

defineEmits(['selectChapter'])

const heroTitles = {
  A1: 'Guten Tag!',
  A2: 'Ausbildung & Leben',
  B1: 'Mittelstufe B1',
  B2: 'Oberstufe B2'
}

const heroInfo = computed(() => ({
  title: heroTitles[props.currentLevel] || props.currentLevel
}))

function getMasteredCount(deck) {
  let count = 0
  deck.items.forEach(item => {
    if (props.memoryLedger.masteredKeys[`${deck.id}-${item.de}`] === 'mastered') count++
  })
  return count
}

const totalMasteredCount = computed(() => {
  return props.decks.reduce((sum, d) => sum + getMasteredCount(d), 0)
})

const totalWordsInLevel = computed(() => {
  return props.decks.reduce((sum, d) => sum + (d.items ? d.items.length : 0), 0)
})

const completedModulesCount = computed(() => {
  return props.decks.filter(d => isDeckComplete(d)).length
})

const completionPercent = computed(() => {
  if (props.decks.length === 0) return 0
  return Math.round((completedModulesCount.value / props.decks.length) * 100)
})

function getDeckProgressPercent(deck) {
  if (!deck.items || deck.items.length === 0) return 0
  return Math.round((getMasteredCount(deck) / deck.items.length) * 100)
}

function isDeckComplete(deck) {
  return props.memoryLedger.quizScores[deck.id] !== undefined || getDeckProgressPercent(deck) === 100
}

function getDeckBadgeText(deck) {
  if (props.memoryLedger.quizScores[deck.id] !== undefined) {
    return `✓ ${props.memoryLedger.quizScores[deck.id]}%`
  }
  const percent = getDeckProgressPercent(deck)
  return percent > 0 ? `${percent}% complete` : 'Start'
}

// Rotasi gradien futuristik persis seperti di gambar
function getFuturisticGradient(index) {
  const gradients = [
    'theme-teal',     // Emerald Deep Teal
    'theme-cyan',     // Cyan Azure
    'theme-sapphire', // Midnight Blue
    'theme-purple',   // Indigo Violet
    'theme-teal',     // Deep Teal
    'theme-purple',   // Cyber Violet
    'theme-teal',     // Deep Teal
    'theme-teal',     // Deep Teal
    'theme-amber'     // Cyber Amber Gold
  ]
  return gradients[index % gradients.length]
}

function getNeonBarColor(deck) {
  return isDeckComplete(deck) ? 'bar-neon-green' : 'bar-neon-cyan-purple'
}
</script>

<style scoped>
.dashboard-wrap {
  padding: 32px 0 60px;
}

/* Hero Section */
.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.level-sub {
  font-family: 'Space Grotesk', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: #38BDF8;
  letter-spacing: 0.08em;
}

.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.3rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 6px 0 8px;
}

.badge-de {
  font-size: 1.1rem;
  color: #38BDF8;
  font-weight: 800;
}

.hero-desc {
  color: var(--text-muted);
  font-size: 0.95rem;
  max-width: 600px;
}

.module-stat-text {
  font-family: 'Space Grotesk', monospace;
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.metric-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 22px 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.metric-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.icon-book { background: rgba(56, 189, 248, 0.12); }
.icon-target { background: rgba(239, 68, 68, 0.12); }
.icon-check { background: rgba(16, 185, 129, 0.12); }

.metric-info h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.9rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.1;
  margin: 0;
}

.metric-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-main);
  margin-top: 4px;
}

.metric-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Section Title */
.section-divider {
  margin-bottom: 24px;
}

.section-divider h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-main);
}

.count-tag {
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.9rem;
}

/* ================= FUTURISTIC CARDS GRID ================= */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 22px;
}

.futuristic-card {
  border-radius: 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 180px;
}

.futuristic-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.7), 0 0 20px rgba(56, 189, 248, 0.15);
}

/* Gradient Themes Sesuai Gambar */
.theme-teal {
  background: radial-gradient(circle at 80% 20%, rgba(13, 148, 136, 0.55) 0%, rgba(15, 23, 42, 0.95) 85%);
}

.theme-cyan {
  background: radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.5) 0%, rgba(15, 23, 42, 0.95) 85%);
}

.theme-sapphire {
  background: radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.5) 0%, rgba(15, 23, 42, 0.95) 85%);
}

.theme-purple {
  background: radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.5) 0%, rgba(15, 23, 42, 0.95) 85%);
}

.theme-amber {
  background: radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.55) 0%, rgba(15, 23, 42, 0.95) 85%);
}

/* Inner Glass Shell */
.card-glass-shell {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

/* Inner Frosted Glass Box (Kotak Judul) */
.inner-glass-box {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 20px;
}

.ch-sub-code {
  font-family: 'Space Grotesk', monospace;
  font-size: 0.68rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 6px;
}

.ch-title-txt {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.98rem;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Bottom Progress and Badge Area */
.card-action-bottom {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-track-neon {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
}

.progress-bar-neon {
  height: 100%;
  border-radius: 6px;
  transition: width 0.4s ease;
}

.bar-neon-green {
  background: #00F5A0;
  box-shadow: 0 0 10px rgba(0, 245, 160, 0.8);
}

.bar-neon-cyan-purple {
  background: linear-gradient(90deg, #00D2FF 0%, #9254DE 100%);
  box-shadow: 0 0 10px rgba(0, 210, 255, 0.6);
}

.ratio-indicator {
  font-family: 'Space Grotesk', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
}

.status-badge-row {
  display: flex;
  justify-content: flex-start;
}

/* Futuristic Pill Badges */
.futuristic-badge {
  font-family: 'Space Grotesk', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-success {
  background: rgba(0, 245, 160, 0.12);
  color: #00F5A0;
  border: 1px solid rgba(0, 245, 160, 0.3);
}

.badge-progress {
  background: rgba(0, 210, 255, 0.12);
  color: #00D2FF;
  border: 1px solid rgba(0, 210, 255, 0.3);
}

@media (max-width: 900px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>