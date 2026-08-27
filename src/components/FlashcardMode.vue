<template>
  <div id="screen-flashcards" class="screen-flashcards-wrap">
    <!-- Top Bar Navigation -->
    <div class="top-nav-row">
      <div class="left-group">
        <button class="btn-back-cyber" @click="$emit('back')">← Back</button>
        <div class="chapter-badge-title">
          <span class="chap-emoji">{{ deck?.emoji || '📖' }}</span>
          <span class="chap-name-txt">{{ deck?.name }}</span>
        </div>
      </div>
      <div class="right-group">
        <span class="counter-indicator">{{ fcIndex + 1 }}/{{ deck?.items.length }}</span>
      </div>
    </div>

    <!-- Progress Track Neon Gradient -->
    <div class="neon-track">
      <div 
        class="neon-progress-fill" 
        :style="{ width: `${((fcIndex + 1) / (deck?.items.length || 1)) * 100}%` }"
      ></div>
    </div>

    <!-- 3D Futuristic Glass Flashcard -->
    <div 
      class="card-container" 
      :class="{ flipped: isFlipped }"
      @click="isFlipped = !isFlipped"
    >
      <div class="card-pivot">
        <!-- Panel Depan: Bahasa Jerman -->
        <div class="card-panel panel-front">
          <div class="badge-top-anchor">
            <span class="panel-badge-label">GERMAN ➔ ENGLISH</span>
          </div>

          <div class="center-content-box">
            <div class="term-display">{{ currentActiveWord?.de }}</div>
            <div class="context-display" v-if="currentActiveWord?.hint">Modul area: {{ currentActiveWord.hint }}</div>
          </div>
          
          <div class="action-bottom-anchor">
            <button 
              class="audio-listen-cyber" 
              @click.stop="triggerVoiceSpeech(currentActiveWord?.de)"
            >
              🔊 Pronounce
            </button>
          </div>
        </div>

        <!-- Panel Belakang: Terjemahan -->
        <div class="card-panel panel-back">
          <div class="badge-top-anchor">
            <span class="panel-badge-label accent-indigo">TRANSLATION</span>
          </div>

          <div class="center-content-box">
            <div class="term-display text-glow-cyan">{{ currentActiveWord?.en }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- SRS Rating Action Bar -->
    <div class="srs-action-area">
      <div class="srs-row" :class="{ 'is-visible': isFlipped }">
        <button class="srs-btn srs-hard" @click="handleRate(1)">Hard</button>
        <button class="srs-btn srs-good" @click="handleRate(3)">Good</button>
        <button class="srs-btn srs-easy" @click="handleRate(5)">Easy</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  deck: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back', 'rateItem', 'finishDeck'])

const fcIndex = ref(0)
const isFlipped = ref(false)

const currentActiveWord = computed(() => {
  if (!props.deck || !props.deck.items) return null
  return props.deck.items[fcIndex.value] || null
})

function triggerVoiceSpeech(text) {
  if (!text) return
  const cleanWord = text.split(',')[0].replace(/\"/g, '').replace(/\|\s*/g, '')
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(cleanWord)
    utterance.lang = 'de-DE'
    utterance.rate = 0.85
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }
}

function handleRate(val) {
  emit('rateItem', { word: currentActiveWord.value, score: val })
  
  isFlipped.value = false
  if (fcIndex.value + 1 >= props.deck.items.length) {
    emit('finishDeck')
  } else {
    fcIndex.value++
  }
}
</script>

<style scoped>
.screen-flashcards-wrap {
  padding: 10px 0 40px;
}

/* Header Navigation Bar */
.top-nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.left-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-back-cyber {
  background: transparent;
  border: none;
  color: #00D2FF;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-back-cyber:hover {
  background: rgba(0, 210, 255, 0.1);
  transform: translateX(-2px);
}

.chapter-badge-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chap-name-txt {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
  color: #FFFFFF;
}

.counter-indicator {
  font-family: 'Space Grotesk', monospace;
  font-size: 0.95rem;
  font-weight: 700;
  color: #38BDF8;
}

/* Neon Progress Bar */
.neon-track {
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  margin-bottom: 40px;
  overflow: hidden;
}

.neon-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00D2FF 0%, #9254DE 100%);
  transition: width 0.35s ease;
}

/* 3D Card Container */
.card-container {
  perspective: 1200px;
  width: 100%;
  max-width: 620px;
  height: 350px;
  margin: 0 auto 36px;
  cursor: pointer;
}

.card-pivot {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-container.flipped .card-pivot {
  transform: rotateY(180deg);
}

/* Glassmorphic Panel */
.card-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 24px;
  background: radial-gradient(circle at 50% 20%, #171F2C 0%, #0B1017 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 24px;
  box-sizing: border-box;
}

.panel-back {
  transform: rotateY(180deg);
  border-color: rgba(146, 84, 222, 0.4);
}

/* Anchored Badges & Buttons */
.badge-top-anchor {
  position: absolute;
  top: 24px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.action-bottom-anchor {
  position: absolute;
  bottom: 24px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.panel-badge-label {
  font-family: 'Space Grotesk', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #38BDF8;
  background: rgba(56, 189, 248, 0.1);
  padding: 4px 14px;
  border-radius: 20px;
  border: 1px solid rgba(56, 189, 248, 0.25);
}

.panel-badge-label.accent-indigo {
  color: #C084FC;
  background: rgba(192, 132, 252, 0.1);
  border-color: rgba(192, 132, 252, 0.25);
}

/* Pusat Konten Kata */
.center-content-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.term-display {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 2.35rem;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.25;
}

.text-glow-cyan {
  color: #F0F9FF;
  text-shadow: 0 0 24px rgba(0, 210, 255, 0.45);
}

.context-display {
  font-size: 0.95rem;
  color: #94A3B8;
  font-style: italic;
  margin-top: 10px;
}

/* Tombol Pronounce */
.audio-listen-cyber {
  background: rgba(255, 255, 255, 0.06);
  color: #38BDF8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 8px 20px;
  border-radius: 25px;
  font-family: inherit;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.audio-listen-cyber:hover {
  background: rgba(56, 189, 248, 0.15);
  transform: translateY(-2px);
}

/* SRS Action Area */
.srs-action-area {
  min-height: 60px;
}

.srs-row {
  display: flex;
  gap: 14px;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
  transition: all 0.3s ease;
}

.srs-row.is-visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.srs-btn {
  padding: 14px 28px;
  border-radius: 12px;
  border: none;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  flex: 1;
  max-width: 140px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.srs-btn:hover {
  transform: translateY(-2px);
}

.srs-hard {
  background: rgba(239, 68, 68, 0.15);
  color: #F87171;
  border: 1px solid rgba(239, 68, 68, 0.35);
}

.srs-good {
  background: rgba(59, 130, 246, 0.15);
  color: #60A5FA;
  border: 1px solid rgba(59, 130, 246, 0.35);
}

.srs-easy {
  background: rgba(16, 185, 129, 0.15);
  color: #34D399;
  border: 1px solid rgba(16, 185, 129, 0.35);
}


</style>