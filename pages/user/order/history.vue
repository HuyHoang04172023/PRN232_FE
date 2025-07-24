<template>
    <div class="order-history container py-5">
        <div class="text-center mb-5">
            <h2 class="fw-bold text-primary">Lịch sử đơn hàng</h2>
            <p class="text-muted">Xem lại các đơn hàng bạn đã đặt</p>
        </div>

        <ul class="nav nav-pills justify-content-center mb-4 gap-2">
            <li class="nav-item" v-for="status in statuses" :key="status.key">
                <button class="nav-link px-4 py-2" :class="{ active: currentTab === status.key }"
                    @click="currentTab = status.key">
                    {{ status.label }}
                </button>
            </li>
        </ul>

        <div v-if="filteredOrders.length === 0" class="text-center text-muted py-4">
            Không có đơn hàng nào trong mục này.
        </div>

        <div v-else v-for="order in filteredOrders" :key="order.orderId" class="card mb-4 shadow-sm border-0"
            @click="goToOrderDetail(order.orderId)" style="cursor: pointer">
            <div class="card-header bg-light d-flex justify-content-between align-items-center border-0">
                <strong>Đơn hàng #{{ order.orderId }}</strong>
                <span :class="statusClass(order.status)">{{ convertStatus(order.status) }}</span>
            </div>

            <div class="card-body">
                <p><strong>Ngày đặt:</strong> {{ formatDate(order.createdAt) }}</p>
                <p><strong>Cửa hàng:</strong> {{ order.shop.shopName }}</p>
                <p><strong>Địa chỉ giao:</strong> {{ order.shippingAddress }}</p>

                <ul class="list-group list-group-flush mt-3 rounded">
                    <li class="list-group-item d-flex justify-content-between align-items-center"
                        v-for="item in order.items" :key="item.productVariantId">
                        <span>
                            {{ item.productName }}
                            <span class="badge bg-secondary ms-2">x{{ item.orderItemQuantity }}</span>
                        </span>
                        <span>{{ formatPrice(item.orderItemPrice) }}đ</span>
                    </li>
                </ul>


                <div class="mt-3 text-end fw-bold">
                    Tổng tiền: <span class="text-success">{{ formatPrice(getOrderTotal(order)) }}đ</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useNuxtApp, useRouter } from 'nuxt/app'

const { $repositories } = useNuxtApp()
const router = useRouter()

const orders = ref<any[]>([])
const userId = ref<string | null>(null)
const currentTab = ref<string>('pending')

const statuses = [
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'doing', label: 'Đang chuẩn bị' },
    { key: 'success', label: 'Hoàn thành' },
    { key: 'cancel', label: 'Đã hủy' }
]

const fetchOrders = async (id: number) => {
    try {
        orders.value = await $repositories.orderRepository.getOrdersByUserId(id)
    } catch (err) {
        console.error(err)
    }
}

const filteredOrders = computed(() => {
    return orders.value.filter(order => order.status === currentTab.value)
})

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
.order-history {
    max-width: 900px;
}

.nav-pills .nav-link {
    border-radius: 20px;
    font-weight: 500;
}

.nav-pills .nav-link.active {
    background-color: #0d6efd;
}

.card:hover {
    transform: translateY(-2px);
    transition: all 0.2s ease-in-out;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
}
</style>
