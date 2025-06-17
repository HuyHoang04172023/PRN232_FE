<template>
  <div class="p-10">
    <h1 class="text-3xl font-bold">🎉 Admin Dashboard</h1>
    <p>Role của bạn là: {{ role }}</p>
  </div>
</template>

<script setup lang="ts">
const role = ref("");

onMounted(() => {
  role.value = localStorage.getItem("role") || "";
});
</script>