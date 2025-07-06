<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-3">
    <NuxtLink to="/" class="navbar-brand">Trang chủ</NuxtLink>

    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
      <!-- Admin -->
      <template v-if="role === 'admin'">
        <li class="nav-item">
          <NuxtLink to="/admin/dashboard" class="nav-link">Admin Dashboard</NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/admin/users" class="nav-link">Quản lý người dùng</NuxtLink>
        </li>
      </template>

      <!-- Sale -->
      <template v-if="role === 'sale'">
        <li class="nav-item">
          <NuxtLink to="/sale/products" class="nav-link">Danh sách sản phẩm</NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/seller/orders" class="nav-link">Đơn hàng</NuxtLink>
        </li>
      </template>

      <!-- Manager -->
      <template v-if="role === 'manager'">
        <li class="nav-item">
          <NuxtLink to="/manager/approve/shop" class="nav-link">Duyệt cửa hàng</NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/manager/approve/product" class="nav-link">Duyệt sản phẩm</NuxtLink>
        </li>
      </template>

      <!-- User -->
      <template v-if="role === 'user'">
        <li class="nav-item">
          <NuxtLink to="/user/shop/create" class="nav-link">Yêu cầu mở cửa hàng</NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/user/cart" class="nav-link">Giỏ hàng</NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/user/order/history" class="nav-link">Lịch sử đơn hàng</NuxtLink>
        </li>
      </template>

      <!-- Khách chưa đăng nhập -->
      <template v-if="!isAuthenticated">
        <li class="nav-item">
          <NuxtLink to="/login" class="nav-link">Đăng nhập</NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink to="/register" class="nav-link">Đăng ký</NuxtLink>
        </li>
      </template>
    </ul>

    <div v-if="isAuthenticated">
      <button @click="handleLogout" class="btn btn-outline-danger btn-sm">Đăng xuất</button>
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
  location.reload() // hoặc navigateTo('/login')
}
</script>
