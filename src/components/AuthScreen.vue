<template>
  <div id="screen-auth">
    <div class="auth-bg-layer"></div>

    <div class="auth-card">
      <div class="brand-badge-row">
        <h1 class="...">
  Willkommen!
  <img 
    src="https://flagcdn.com/w40/de.png" 
    alt="German Flag" 
    class="inline-block w-6 h-auto align-middle rounded-sm ml-1"
  />
</h1>
      </div>
      <p class="auth-sub-desc">Enter your username or Sync Key to track your learning progress.</p>
      
      <div class="auth-input-group">
        <input 
          type="text" 
          v-model="inputUsername" 
          class="auth-input" 
          placeholder="Your name or Sync Key" 
          autocomplete="off"
          @keyup.enter="submitLogin"
        />
        <button class="auth-btn" @click="submitLogin">Masuk / Mulai Belajar</button>
      </div>
      
      <div class="auth-status" :style="{ color: statusColor }">{{ statusMsg }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  statusMsg: {
    type: String,
    default: ''
  },
  statusColor: {
    type: String,
    default: '#38BDF8'
  }
})

const emit = defineEmits(['login'])
const inputUsername = ref('')

function submitLogin() {
  if (inputUsername.value.trim() !== '') {
    emit('login', inputUsername.value.trim().toLowerCase())
  }
}
</script>

<style scoped>
#screen-auth {
  position: fixed;
  top: 0; 
  left: 0; 
  width: 100vw; 
  height: 100vh;
  background-color: #0B0E14;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
  box-sizing: border-box;
}

/* Background Image Layer */
.auth-bg-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/bg_login.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: contrast(110%) brightness(0.4) saturate(120%);
  opacity: 0.6;
  z-index: 1;
}

/* Dark Glassmorphic Card */
.auth-card {
  position: relative;
  z-index: 2;
  background: radial-gradient(circle at top, rgba(23, 31, 44, 0.85) 0%, rgba(11, 16, 23, 0.95) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 40px 32px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 210, 255, 0.08);
  text-align: center;
  box-sizing: border-box;
}

.brand-badge-row h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.badge-de {
  font-size: 1rem;
  color: #38BDF8;
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 2px 8px;
  border-radius: 6px;
}

.auth-sub-desc {
  font-size: 0.92rem;
  color: #94A3B8;
  margin-bottom: 28px;
  line-height: 1.5;
}

.auth-input-group {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 16px;
}

.auth-input {
  width: 100%;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  color: #FFFFFF;
  outline: none;
  text-align: center;
  box-sizing: border-box;
  transition: all 0.25s ease;
}

.auth-input::placeholder {
  color: #64748B;
}

.auth-input:focus {
  border-color: #38BDF8;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.25);
}

/* Tombol Masuk Futuristik */
.auth-btn {
  width: 100%;
  background: linear-gradient(90deg, #4F46E5 0%, #06B6D4 100%);
  color: #FFFFFF;
  border: none;
  padding: 16px;
  border-radius: 14px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  letter-spacing: 0.02em;
  box-shadow: 0 0 20px rgba(79, 70, 229, 0.4);
  transition: all 0.25s ease;
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.6);
}

.auth-btn:active {
  transform: translateY(0);
}

.auth-status {
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 10px;
  min-height: 20px;
}
</style>