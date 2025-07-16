<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
    <NuxtLink to="/" class="navbar-brand fw-bold text-primary">Trang chủ</NuxtLink>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
      <!-- Left menu -->
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <!-- Admin -->
        <template v-if="role === 'admin'">
          <li class="nav-item"><NuxtLink to="/admin/dashboard" class="nav-link">Dashboard</NuxtLink></li>
          <li class="nav-item"><NuxtLink to="/admin/users" class="nav-link">Người dùng</NuxtLink></li>
        </template>

        <!-- Sale -->
        <template v-if="role === 'sale'">
          <li class="nav-item"><NuxtLink to="/sale/products" class="nav-link">Sản phẩm</NuxtLink></li>
          <li class="nav-item"><NuxtLink to="/sale/order" class="nav-link">Đơn hàng</NuxtLink></li>
          <li class="nav-item"><NuxtLink to="/sale/statistic" class="nav-link">Thống kê</NuxtLink></li>
        </template>

        <!-- Manager -->
        <template v-if="role === 'manager'">
          <li class="nav-item"><NuxtLink to="/manager/approve/shop" class="nav-link">Duyệt shop</NuxtLink></li>
          <li class="nav-item"><NuxtLink to="/manager/approve/product" class="nav-link">Duyệt sản phẩm</NuxtLink></li>
        </template>

        <!-- User -->
        <template v-if="role === 'user'">
          <li class="nav-item"><NuxtLink to="/user/shop/create" class="nav-link">Mở cửa hàng</NuxtLink></li>
          <li class="nav-item"><NuxtLink to="/user/cart" class="nav-link">Giỏ hàng</NuxtLink></li>
          <li class="nav-item"><NuxtLink to="/user/order/history" class="nav-link">Lịch sử</NuxtLink></li>
        </template>

        <!-- Guest -->
        <template v-if="!isAuthenticated">
          <li class="nav-item"><NuxtLink to="/login" class="nav-link">Đăng nhập</NuxtLink></li>
          <li class="nav-item"><NuxtLink to="/register" class="nav-link">Đăng ký</NuxtLink></li>
        </template>
      </ul>

      <!-- Right menu -->
      <div v-if="isAuthenticated" class="d-flex align-items-center">
        <span class="me-3 text-secondary small">({{ role }})</span>
        <button @click="handleLogout" class="btn btn-outline-danger btn-sm">Đăng xuất</button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
const { logout } = useAuth()

const role = ref<string>('')
const isAuthenticated = computed(() => !!role.value)

onMounted(() => {
  role.value = localStorage.getItem('role') || ''
})

const handleLogout = async () => {
  await logout()
  localStorage.removeItem('role')
  location.reload()
}
</script>
