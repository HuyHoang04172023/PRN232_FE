<template>
  <div class="position-absolute top-50 start-50 translate-middle w-100" style="max-width: 400px;">
    <div class="card shadow-sm p-4 bg-white border-0">
      <div class="text-center mb-4">
        <h4 class="fw-bold text-primary">Đăng nhập</h4>
        <p class="text-muted small">Vui lòng nhập thông tin tài khoản</p>
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input v-model="email" type="email" id="email" class="form-control" placeholder="Nhập email" />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Mật khẩu</label>
        <input v-model="password" type="password" id="password" class="form-control" placeholder="Nhập mật khẩu" />
      </div>

      <button class="btn btn-primary w-100" @click="handleLogin">Đăng nhập</button>

      <p v-if="error" class="text-danger text-center mt-3 mb-0">{{ error }}</p>
    </div>
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
    if (process.client) {
      localStorage.setItem('role', 'user');
    }

    await navigateTo("/");
    location.reload();
  } else {
    error.value = "Sai email hoặc mật khẩu";
  }
};
</script>