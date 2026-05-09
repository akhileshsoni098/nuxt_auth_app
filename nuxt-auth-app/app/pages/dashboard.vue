<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const { fetchProfile, logout } = useAuth();

// useAsyncData server aur client dono par kaam karta hai
// 'profile' ek unique key hai caching ke liye
const { data: profileResponse, pending, error } = await useAsyncData(
  'profile', 
  () => fetchProfile()
);

// Agar error aaye ya token expire ho jaye
if (error.value || (profileResponse.value && !profileResponse.value.status)) {
  logout();
}

// Shortcut for template access
const user = computed(() => profileResponse.value?.data);
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- Nuxt Loading Indicator automatically pending state handle karta hai -->
    <div v-if="pending" class="loading">
      <div class="spinner"></div>
      <p>Loading your profile...</p>
    </div>

    <div v-else-if="user" class="profile-card">
      <header>
        <h1>Welcome, {{ user.name }}!</h1>
        <button @click="logout" class="logout-btn">Logout</button>
      </header>

      <div class="info-grid">
        <div class="info-item">
          <label>Email</label>
          <span>{{ user.email }}</span>
        </div>
        <div class="info-item">
          <label>Age</label>
          <span>{{ user.age || 'N/A' }}</span>
        </div>
        <div class="info-item">
          <label>Marital Status</label>
          <span>{{ user.is_married ? 'Married' : 'Single' }}</span>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <p>Could not load user data.</p>
      <button @click="logout">Go Back to Login</button>
    </div>
  </div>
</template>

<style scoped>
/* Dashboard styling */
.dashboard-wrapper {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  font-family: sans-serif;
}

.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  padding: 30px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.info-grid {
  display: grid;
  gap: 20px;
}

.info-item label {
  display: block;
  font-size: 0.8rem;
  color: #888;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.info-item span {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.logout-btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.loading {
  text-align: center;
  padding: 50px;
}
</style>