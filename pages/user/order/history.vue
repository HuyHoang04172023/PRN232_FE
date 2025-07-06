<template>
    <div class="container py-4">
        <h2 class="mb-4">Lịch sử đơn hàng</h2>

        <div v-if="orders.length === 0" class="text-muted">Bạn chưa có đơn hàng nào.</div>

        <div v-else v-for="order in orders" :key="order.orderId" class="card mb-4 shadow-sm"
            @click="goToOrderDetail(order.orderId)" style="cursor: pointer">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div><strong>Đơn hàng #{{ order.orderId }}</strong></div>
                <span :class="statusClass(order.status)">{{ convertStatus(order.status) }}</span>
            </div>
            <div class="card-body">
                <p><strong>Ngày đặt:</strong> {{ formatDate(order.createdAt) }}</p>
                <p><strong>Cửa hàng:</strong> {{ order.shop.shopName }}</p>
                <p><strong>Địa chỉ giao:</strong> {{ order.shippingAddress }}</p>

                <ul class="list-group list-group-flush mt-3">
                    <li class="list-group-item d-flex justify-content-between align-items-center"
                        v-for="item in order.items" :key="item.productVariantId">
                        {{ item.productName }} (x{{ item.orderItemQuantity }})
                        <span>{{ formatPrice(item.orderItemPrice) }}đ</span>
                    </li>
                </ul>

                <div class="mt-3 text-end">
                    <strong>Tổng tiền: {{ formatPrice(getOrderTotal(order)) }}đ</strong>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useRouter } from 'nuxt/app'
import { ref, onMounted } from 'vue'

const { $repositories } = useNuxtApp()
const router = useRouter()

const orders = ref<any[]>([])
const userId = ref<string | null>(null)

const fetchOrders = async (id: number) => {
    try {
        orders.value = await $repositories.orderRepository.getOrdersByUserId(id)
    } catch (err) {
        console.error(err)
    }
}

const goToOrderDetail = (orderId: number) => {
    router.push(`/user/order/${orderId}`)
}

const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN')
}

const formatDate = (isoDate: string) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const getOrderTotal = (order: any) => {
    return order.items.reduce(
        (total: number, item: any) => total + item.orderItemPrice * item.orderItemQuantity,
        0
    )
}

const convertStatus = (status: string) => {
    switch (status) {
        case 'pending':
            return 'Chờ xác nhận'
        case 'doing':
            return 'Đang chuẩn bị'
        case 'success':
            return 'Hoàn thành'
        case 'cancel':
            return 'Đã hủy'
        default:
            return 'Không xác định'
    }
}

const statusClass = (status: string) => {
    switch (status) {
        case 'pending':
            return 'badge bg-warning text-dark'
        case 'doing':
            return 'badge bg-primary'
        case 'success':
            return 'badge bg-success'
        case 'cancel':
            return 'badge bg-danger'
        default:
            return 'badge bg-secondary'
    }
}

onMounted(() => {
    if (process.client) {
        const rawUserId = localStorage.getItem('accountId')
        if (rawUserId) {
            userId.value = rawUserId
            fetchOrders(Number(rawUserId))
        }
    }
})
</script>

<style scoped>
.card:hover {
    transform: scale(1.01);
    transition: 0.2s ease-in-out;
    border: 1px solid #0d6efd;
}
</style>
