<template>
  <div class="api-test">
    <h3>API 连接测试</h3>
    <button @click="testApi" :disabled="loading">
      {{ loading ? '测试中...' : '测试API连接' }}
    </button>
    <div v-if="result" class="result">
      <pre>{{ JSON.stringify(result, null, 2) }}</pre>
    </div>
    <div v-if="error" class="error">
      <p>错误: {{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { timelineAPI } from '../utils/api';

const loading = ref(false);
const result = ref(null);
const error = ref('');

const testApi = async () => {
  loading.value = true;
  error.value = '';
  result.value = null;
  
  try {
    const response = await timelineAPI.getItems();
    result.value = response;
  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.api-test {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.result {
  margin-top: 1rem;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
}

.error {
  margin-top: 1rem;
  color: #ef4444;
  background: #fef2f2;
  padding: 1rem;
  border-radius: 0.375rem;
}

button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
