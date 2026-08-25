<template>
  <div class="app-root" :class="{ 'dark-theme': isDarkMode, 'light-theme': !isDarkMode }">
    <AuthScreen 
      v-if="!activeSyncKeyStr" 
      :statusMsg="authStatusMsg" 
      :statusColor="authStatusColor"
      @login="handleUserLogin"
    />

    <div v-else>
      <TopNav 
        :username="activeSyncKeyStr"
        :currentLevel="currentLevel"
        :isDarkMode="isDarkMode"
        @changeLevel="switchLevelSection"
        @goHome="switchScreen('home')"
        @logout="handleUserLogout"
        @toggleTheme="toggleTheme"
      />

      <main class="main-container">
        <DashboardHome 
          v-if="activeScreen === 'home'"
          :currentLevel="currentLevel"
          :levelDescription="LEVEL_DESCRIPTIONS[currentLevel]"
          :decks="activeDataMapping"
          :memoryLedger="memoryLedger"
          @selectChapter="openChapter"
        />

        <FlashcardMode 
          v-else-if="activeScreen === 'flashcards'"
          :deck="currentDeckContext"
          @back="switchScreen('home')"
          @rateItem="handleRateItem"
          @finishDeck="startQuizSession"
        />

        <QuizEngine 
          v-else-if="activeScreen === 'quiz'"
          :deck="currentDeckContext"
          @finish="handleQuizFinish"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

import AuthScreen from './components/AuthScreen.vue'
import TopNav from './components/TopNav.vue'
import DashboardHome from './components/DashboardHome.vue'
import FlashcardMode from './components/FlashcardMode.vue'
import QuizEngine from './components/QuizEngine.vue'

import { NETZWERK_DATA_MAPPING_A1 } from './data/vocab-data-A1.js'
import { NETZWERK_DATA_MAPPING_A2 } from './data/vocab-data-A2.js'
import { NETZWERK_DATA_MAPPING_B1 } from './data/vocab-data-B1.js'
import { NETZWERK_DATA_MAPPING_B2 } from './data/vocab-data-B2.js'

const LEVEL_DESCRIPTIONS = {
  'A1': 'Grundwortschatz A1 — Alltagsgespräche, Familie, Berufe und Grundgrammatik.',
  'A2': 'Erweiterter Wortschatz A2 — Reise, Arbeit, Gesundheit, Orientierung und Alltag.',
  'B1': 'Mittelstufe B1 — Meinungen ausdrücken, Berufswelt, Kultur und Umwelt.',
  'B2': 'Fortgeschrittene B2 — Fachbegriffe, Diskussionen und Nuancen.'
}

const rawDatasets = {
  'A1': NETZWERK_DATA_MAPPING_A1 || [],
  'A2': NETZWERK_DATA_MAPPING_A2 || [],
  'B1': NETZWERK_DATA_MAPPING_B1 || [],
  'B2': NETZWERK_DATA_MAPPING_B2 || []
}

// Dark Mode Persistence
const isDarkMode = ref(localStorage.getItem('gf_dark_mode') === null ? true : localStorage.getItem('gf_dark_mode') === 'true')

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('gf_dark_mode', isDarkMode.value.toString())
}

const activeSyncKeyStr = ref(localStorage.getItem('lf_cloud_sync_key') || '')
const authStatusMsg = ref('')
const authStatusColor = ref('#2563eb')
const currentLevel = ref('A1')
const activeScreen = ref('home')
const currentDeckContext = ref(null)

const memoryLedger = ref({
  masteredKeys: {},
  reviewTotals: 0,
  quizScores: {}
})

const activeDataMapping = computed(() => rawDatasets[currentLevel.value] || [])

async function handleUserLogin(username) {
  authStatusMsg.value = "Menghubungkan & Memuat data..."
  authStatusColor.value = "#2563eb"

  try {
    const recordRef = doc(db, "user_progress", username)
    const snap = await getDoc(recordRef)

    if (snap.exists()) {
      const data = snap.data()
      memoryLedger.value = {
        masteredKeys: data.masteredKeys || {},
        reviewTotals: data.reviewTotals || 0,
        quizScores: data.quizScores || {}
      }
    } else {
      memoryLedger.value = { masteredKeys: {}, reviewTotals: 0, quizScores: {} }
      await setDoc(recordRef, memoryLedger.value)
    }

    activeSyncKeyStr.value = username
    localStorage.setItem('lf_cloud_sync_key', username)
    activeScreen.value = 'home'
  } catch (error) {
    console.error(error)
    authStatusMsg.value = "Gagal terhubung ke database."
    authStatusColor.value = "#dc2626"
  }
}

function handleUserLogout() {
  localStorage.removeItem('lf_cloud_sync_key')
  activeSyncKeyStr.value = ''
  authStatusMsg.value = ''
  memoryLedger.value = { masteredKeys: {}, reviewTotals: 0, quizScores: {} }
}

async function pushToCloud() {
  if (!activeSyncKeyStr.value) return
  try {
    await setDoc(doc(db, "user_progress", activeSyncKeyStr.value), memoryLedger.value)
  } catch (e) { console.error("Sync Error:", e) }
}

function switchScreen(screenName) {
  activeScreen.value = screenName
}

function switchLevelSection(lvl) {
  currentLevel.value = lvl
  activeScreen.value = 'home'
}

function openChapter(deck) {
  currentDeckContext.value = deck
  activeScreen.value = 'flashcards'
}

async function handleRateItem({ word, score }) {
  memoryLedger.value.reviewTotals++
  if (score === 5) {
    const compKey = `${currentDeckContext.value.id}-${word.de}`
    memoryLedger.value.masteredKeys[compKey] = 'mastered'
  }
  await pushToCloud()
}

function startQuizSession() {
  activeScreen.value = 'quiz'
}

async function handleQuizFinish(finalScore) {
  memoryLedger.value.quizScores[currentDeckContext.value.id] = finalScore
  await pushToCloud()
  activeScreen.value = 'home'
}

onMounted(() => {
  if (activeSyncKeyStr.value) {
    handleUserLogin(activeSyncKeyStr.value)
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap');
/* Dynamic Color Variables */
.dark-theme {
  --bg-app: #0B0E14;
  --nav-bg: rgba(11, 14, 20, 0.85);
  --card-bg: #151A23;
  --card-glass: rgba(15, 23, 42, 0.7);
  --text-main: #F8FAFC;
  --text-muted: #94A3B8;
  --border-color: #242D3D;
  --btn-group-bg: #151A23;
  --shadow-sm: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.light-theme {
  --bg-app: #F8FAFC;
  --nav-bg: rgba(255, 255, 255, 0.85);
  --card-bg: #FFFFFF;
  --card-glass: rgba(255, 255, 255, 0.75);
  --text-main: #0F172A;
  --text-muted: #64748B;
  --border-color: #E2E8F0;
  --btn-group-bg: #E2E8F0;
  --shadow-sm: 0 4px 20px rgba(0, 0, 0, 0.05);
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: background-color 0.3s ease;
}

.app-root {
  background-color: var(--bg-app);
  min-height: 100vh;
  color: var(--text-main);
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
</style>