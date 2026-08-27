<template>
  <div>
    <!-- SCREEN: QUIZ ENGINE -->
    <div v-if="!showResults" id="screen-quiz" class="screen active">
      <div class="screen-control-row">
        <h2 style="font-family:'Space Grotesk', sans-serif; font-weight:700;">Chapter Assessment</h2>
        <div class="view-meta-counter">Question {{ currentIndex + 1 }} of {{ questions.length }}</div>
      </div>
      
      <div class="quiz-panel-wrapper" v-if="currentQ">
        <!-- Multiple Choice Stage -->
        <div v-if="currentQ.type === 'mc'">
          <div class="quiz-type-badge mc">Recognition Stage</div>
          <span class="quiz-prompt-lbl">Identify the correct English meaning:</span>
          <div class="term-display" style="font-size:2rem; text-align:left; margin-top:4px;">{{ currentQ.germanWord }}</div>
          
          <div class="matrix-options">
            <button 
              v-for="(opt, idx) in currentQ.choices" 
              :key="idx" 
              class="matrix-btn"
              :class="{
                correct: isSubmitted && opt === currentQ.englishWord,
                wrong: isSubmitted && selectedMc === opt && opt !== currentQ.englishWord
              }"
              :disabled="isSubmitted"
              @click="selectOption(opt)"
            >
              {{ opt }}
            </button>
          </div>
        </div>

        <!-- Active Recall (Typing) Stage -->
        <div v-else>
          <div class="quiz-type-badge type">Active Recall Stage</div>
          <span class="quiz-prompt-lbl">Translate this term into German:</span>
          <div class="term-display" style="font-size:2rem; text-align:left; margin-top:4px;">{{ currentQ.englishWord }}</div>

          <div class="text-input-field-row">
            <input 
              type="text" 
              v-model="typedAnswer"
              class="input-box-control" 
              :class="{
                correct: isSubmitted && isTypingCorrect,
                wrong: isSubmitted && !isTypingCorrect
              }"
              placeholder="Type the German entry..." 
              autocomplete="off"
              :disabled="isSubmitted"
              @keyup.enter="checkTyping"
            />
            <button class="btn-verify" :disabled="isSubmitted" @click="checkTyping">Verify</button>
          </div>

          <div 
            v-if="isSubmitted" 
            class="typing-feedback-banner" 
            :class="{ correct: isTypingCorrect, wrong: !isTypingCorrect }"
          >
            {{ isTypingCorrect ? 'Richtig! Perfect active recall match.' : `Correct form: ${currentQ.germanWord}` }}
          </div>
        </div>
      </div>

      <div class="footer-action-align" style="margin-top:20px;">
        <button 
          v-if="isSubmitted" 
          class="auth-btn" 
          style="padding:12px 24px; width:auto; float:right;" 
          @click="nextQuestion"
        >
          {{ (currentIndex + 1 === questions.length) ? 'Finish Quiz' : 'Next Question →' }}
        </button>
      </div>
    </div>

    <!-- SCREEN: RESULTS SUMMARY -->
    <div v-else id="screen-results" class="screen active">
      <div class="results-modal-box">
        <div class="score-radial">{{ finalScore }}%</div>
        <h2>Evaluation Complete</h2>
        <button class="auth-btn" style="margin-top:20px;" @click="closeQuiz">Return to Dashboard</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  deck: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['finish'])

const questions = ref([])
const currentIndex = ref(0)
const score = ref(0)
const isSubmitted = ref(false)

const selectedMc = ref('')
const typedAnswer = ref('')
const isTypingCorrect = ref(false)

const showResults = ref(false)
const finalScore = ref(0)

const currentQ = computed(() => questions.value[currentIndex.value] || null)

onMounted(() => {
  buildQuiz()
})

function buildQuiz() {
  if (!props.deck || !props.deck.items) return
  const qList = []
  
  props.deck.items.forEach((item, index) => {
    const incorrectOptions = props.deck.items.filter(x => x.en !== item.en).map(x => x.en)
    let combinedChoices = [item.en, ...incorrectOptions].slice(0, 4).sort(() => Math.random() - 0.5)
    const exerciseType = (index % 2 === 0) ? 'mc' : 'type'

    qList.push({
      type: exerciseType,
      germanWord: item.de,
      englishWord: item.en,
      choices: combinedChoices
    })
  })
  questions.value = qList
}

function selectOption(opt) {
  if (isSubmitted.value) return
  selectedMc.value = opt
  isSubmitted.value = true
  if (opt === currentQ.value.englishWord) score.value++
}

function cleanString(str) {
  if (!str) return ''
  return str.toLowerCase()
    .replace(/^(der|die|das)\s+/, '')
    .replace(/,\s*["-].*$/, '')
    .replace(/\|/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

function checkTyping() {
  if (isSubmitted.value || !typedAnswer.value.trim()) return
  const userStr = typedAnswer.value.trim()
  const baseCorrect = currentQ.value.germanWord

  const isExact = userStr.toLowerCase() === baseCorrect.toLowerCase()
  const isLoose = cleanString(userStr) === cleanString(baseCorrect)

  isTypingCorrect.value = isExact || isLoose
  if (isTypingCorrect.value) score.value++
  
  isSubmitted.value = true
}

function nextQuestion() {
  if (currentIndex.value + 1 < questions.value.length) {
    currentIndex.value++
    isSubmitted.value = false
    selectedMc.value = ''
    typedAnswer.value = ''
    isTypingCorrect.value = false
  } else {
    finalScore.value = Math.round((score.value / questions.value.length) * 100)
    showResults.value = true
  }
}

function closeQuiz() {
  emit('finish', finalScore.value)
}
</script>

<style scoped>
.screen-control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.view-meta-counter {
  font-size: 0.85rem;
  color: var(--text-muted, #94A3B8);
}

.quiz-panel-wrapper {
  background: var(--card-bg, #151A23);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid var(--border-color, #242D3D);
}

.quiz-type-badge {
  display: inline-block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.quiz-type-badge.mc {
  background-color: rgba(59, 130, 246, 0.15);
  color: #3B82F6;
}

.quiz-type-badge.type {
  background-color: rgba(16, 185, 129, 0.15);
  color: #10B981;
}

.quiz-prompt-lbl {
  font-size: 0.9rem;
  color: var(--text-muted, #94A3B8);
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
}

.term-display {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  color: var(--text-main, #F8FAFC);
}

.matrix-options {
  display: grid;
  gap: 12px;
  margin-top: 24px;
}

.matrix-btn {
  padding: 18px;
  text-align: left;
  border: 2px solid var(--border-color, #242D3D);
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  background: var(--card-bg, #151A23);
  color: var(--text-main, #F8FAFC);
  font-family: inherit;
  transition: border-color 0.2s;
}

.matrix-btn.correct { background-color: rgba(16, 185, 129, 0.15); border-color: #10B981; color: #10B981; }
.matrix-btn.wrong { background-color: rgba(239, 68, 68, 0.15); border-color: #EF4444; color: #EF4444; }

.text-input-field-row {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.input-box-control {
  flex: 1;
  padding: 16px;
  border: 2px solid var(--border-color, #242D3D);
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  outline: none;
  background: var(--card-bg, #151A23);
  color: var(--text-main, #F8FAFC);
  font-family: inherit;
}

.input-box-control.correct { border-color: #10B981; background-color: rgba(16, 185, 129, 0.15); color: #10B981; }
.input-box-control.wrong { border-color: #EF4444; background-color: rgba(239, 68, 68, 0.15); color: #EF4444; }

.btn-verify {
  background-color: #4F46E5;
  color: #ffffff;
  border: none;
  padding: 0 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.typing-feedback-banner {
  margin-top: 16px;
  padding: 16px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
}

.typing-feedback-banner.correct { background-color: rgba(16, 185, 129, 0.15); color: #10B981; }
.typing-feedback-banner.wrong { background-color: rgba(239, 68, 68, 0.15); color: #EF4444; }

.auth-btn {
  background-color: #4F46E5;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
}

.results-modal-box {
  background-color: var(--card-bg, #151A23);
  padding: 48px;
  border-radius: 20px;
  text-align: center;
  max-width: 500px;
  margin: 40px auto;
  border: 1px solid var(--border-color, #242D3D);
}

.score-radial {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background-color: rgba(79, 70, 229, 0.15);
  color: #818CF8;
  font-size: 2.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28px;
  font-family: 'Space Grotesk', sans-serif;
}
</style>