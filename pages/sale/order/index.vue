<template>
    <div class="container py-5">
        <h2 class="text-center mb-4">Danh sách đơn hàng của cửa hàng</h2>

        <ul class="nav nav-pills justify-content-center mb-4 gap-2">
            <li class="nav-item" v-for="tab in tabs" :key="tab.key">
                <button class="nav-link" :class="{ active: currentTab === tab.key }" @click="currentTab = tab.key">
                    {{ tab.label }}
                </button>
            </li>
        </ul>

        <div v-if="filteredOrders.length === 0" class="text-muted text-center">
            Không có đơn hàng nào trong mục này.
        </div>

        <div v-else v-for="order in filteredOrders" :key="order.orderId" class="card mb-4 shadow-sm border-0"
            @click="goToOrderDetail(order.orderId)" style="cursor: pointer">
            <div class="card-header d-flex justify-content-between align-items-center bg-light">
                <strong>Đơn hàng #{{ order.orderId }}</strong>
                <span :class="statusClass(order.status)">
                    {{ convertStatus(order.status) }}
                </span>
            </div>
            <div class="card-body">
                <p><strong>Ngày đặt:</strong> {{ formatDate(order.createdAt) }}</p>
                <p><strong>Khách hàng:</strong> {{ order.customer.userName }} ({{ order.customer.email }})</p>
                <p><strong>Địa chỉ giao:</strong> {{ order.shippingAddress }}</p>

                <ul class="list-group list-group-flush mt-2">
                    <li class="list-group-item d-flex justify-content-between align-items-center"
                        v-for="item in order.items" :key="item.productVariantId">
                        {{ item.productName }} (x{{ item.orderItemQuantity }})
                        <span>{{ formatPrice(item.orderItemPrice) }}đ</span>
                    </li>
                </ul>

                <div class="mt-3 text-end fw-semibold">
                    Tổng tiền: <span class="text-success">{{ formatPrice(getOrderTotal(order)) }}đ</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useNuxtApp, useRouter } from 'nuxt/app'

const { $toast, $repositories }: any = useNuxtApp()
const router = useRouter()

const shopId = ref<string | null>(null)
const orders = ref<any[]>([])
const currentTab = ref<string>('pending')

const tabs = [
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'doing', label: 'Đang chuẩn bị' },
    { key: 'shipping', label: 'Đang giao hàng' },
    { key: 'success', label: 'Hoàn thành' },
    { key: 'cancel', label: 'Đã hủy' }
]

const fetchOrders = async (id: number) => {
    try {
        orders.value = await $repositories.orderRepository.getOrdersByShopId(id)
    } catch (err) {
        console.error(err)
        $toast.error('Không thể tải danh sách đơn hàng.')
    }
}

const filteredOrders = computed(() => {
    return orders.value.filter((order) => order.status === currentTab.value)
})

const goToOrderDetail = (orderId: number) => {
    router.push(`/sale/order/${orderId}`)
}

const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN')
}

const formatDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleString('vi-VN', {
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
        case 'shipping':
            return 'Đang giao hàng'
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
        case 'shipping':
            return 'badge bg-primary'
        default:
            return 'badge bg-secondary'
    }
}

onMounted(() => {
    if (process.client) {
        const rawShopId = localStorage.getItem('shopId')
        if (rawShopId) {
            shopId.value = rawShopId
            fetchOrders(Number(rawShopId))
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
