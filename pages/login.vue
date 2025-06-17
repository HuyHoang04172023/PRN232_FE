<template>
  <div class="max-w-md mx-auto mt-20 p-4 border rounded">
    <h2 class="text-xl mb-4">Đăng nhập</h2>
    <input v-model="email" class="border p-2 w-full mb-2" placeholder="Email" />
    <input v-model="password" type="password" class="border p-2 w-full mb-2" placeholder="Password" />
    <button class="bg-blue-500 text-white p-2 w-full" @click="handleLogin">Đăng nhập</button>
    <p class="text-red-500 mt-2" v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const email = ref("");
const password = ref("");
const error = ref("");
const { login } = useAuth();

const handleLogin = async () => {
  const success = await login(email.value, password.value);
  if (success) {
    navigateTo("/admin/dashboard");
  } else {
    error.value = "Sai email hoặc mật khẩu";
  }
};
</script>