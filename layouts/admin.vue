<template>
    <div class="d-flex min-vh-100">
        <!-- Sidebar -->
        <aside class="bg-dark text-white p-3" style="width: 220px;">
            <h5 class="text-white mb-4">
                <NuxtLink to="/" class="text-white text-decoration-none">
                    Trang chủ
                </NuxtLink>
            </h5>
            <ul class="nav flex-column">
                <li v-for="item in menuItems" :key="item.to" class="nav-item mb-2">
                    <NuxtLink :to="item.to" class="nav-link text-white" active-class="fw-bold text-primary">
                        <i :class="item.icon" class="me-2"></i>{{ item.label }}
                    </NuxtLink>
                </li>
                <li class="nav-item mt-2">
                    <button class="btn btn-outline-light w-100" @click="handleLogout">
                        <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                    </button>
                </li>
            </ul>
        </aside>

        <!-- Main content -->
        <main class="flex-fill p-4 bg-light">
            <slot />
        </main>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const menuItems = [
    { to: '/admin/statistic/shop-statistics', label: 'Cửa hàng', icon: 'bi bi-shop' },
    { to: '/admin/statistic/user-statistics', label: 'Người dùng', icon: 'bi bi-people' },
    { to: '/admin/statistic/product-statistics', label: 'Sản phẩm', icon: 'bi bi-box-seam' },
    { to: '/admin/statistic/order-statistics', label: 'Đơn hàng', icon: 'bi bi-receipt' },
]

const handleLogout = () => {
    localStorage.removeItem('accountId')
    localStorage.removeItem('role')
    router.push('/login')
}
</script>
