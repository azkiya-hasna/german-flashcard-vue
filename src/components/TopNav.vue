<template>
  <header class="navbar-sticky">
    <div class="nav-inner">
      <!-- Brand Logo -->
      <div class="brand" @click="$emit('goHome')">
        <span>Deutsch</span>
        <span class="badge-pill">Flashcard</span>
      </div>

      <!-- Centered Level Switcher -->
      <nav class="level-switcher">
        <button 
          v-for="lvl in ['A1', 'A2', 'B1', 'B2']" 
          :key="lvl"
          class="level-btn"
          :class="{ active: currentLevel === lvl }"
          @click="$emit('changeLevel', lvl)"
        >
          {{ lvl }}
        </button>
      </nav>

      <!-- Right Actions (Theme + User) -->
      <div class="nav-right">
        <button class="theme-toggle-btn" @click="$emit('toggleTheme')" :title="isDarkMode ? 'Switch to Light' : 'Switch to Dark'">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>

        <div class="user-chip">
          <div class="avatar-circle">{{ username.charAt(0).toUpperCase() }}</div>
          <span class="username-txt">{{ username }}</span>
          <button class="btn-logout" @click="$emit('logout')">Logout</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  username: { type: String, required: true },
  currentLevel: { type: String, default: 'A1' },
  isDarkMode: { type: Boolean, default: true }
})

defineEmits(['goHome', 'logout', 'changeLevel', 'toggleTheme'])
</script>

<style scoped>
.navbar-sticky {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: var(--nav-bg);
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-main);
  cursor: pointer;
}

.badge-pill {
  background: #3B82F6;
  color: white;
  font-size: 0.72rem;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 700;
  letter-spacing: 0.03em;
}

/* Level Switcher Center */
.level-switcher {
  display: flex;
  background: var(--btn-group-bg);
  padding: 4px;
  border-radius: 12px;
  gap: 4px;
  border: 1px solid var(--border-color);
}

.level-btn {
  background: transparent;
  border: none;
  padding: 6px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.level-btn.active {
  background: #4F46E5;
  color: white;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.4);
}

/* Right Section */
.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-toggle-btn {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  font-size: 1.1rem;
  padding: 6px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s;
}

.theme-toggle-btn:hover {
  transform: scale(1.1);
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 4px 12px 4px 6px;
  border-radius: 30px;
}

.avatar-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #4F46E5;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.username-txt {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
}

.btn-logout {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 4px;
}

.btn-logout:hover {
  color: #EF4444;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .nav-inner {
    flex-direction: column;
    gap: 12px;
  }
}
</style>