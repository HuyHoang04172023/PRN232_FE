<template>
    <div class="container py-4" v-if="order">
        <h2 class="mb-4">Chi tiết đơn hàng #{{ order.orderId }}</h2>

        <div class="mb-3">
            <p><strong>Ngày đặt:</strong> {{ formatDate(order.createdAt) }}</p>
            <p><strong>Trạng thái:</strong>
                <span :class="statusClass(order.status)">
                    {{ convertStatus(order.status) }}
                </span>
            </p>
            <p><strong>Cửa hàng:</strong> {{ order.shop.shopName }}</p>
            <p><strong>Người đặt:</strong> {{ order.customer.userName }} ({{ order.customer.email }})</p>
            <p><strong>Địa chỉ giao hàng:</strong> {{ order.shippingAddress }}</p>
            <p><strong>Số điện thoại:</strong> {{ order.phoneNumber }}</p>
            <p><strong>Ghi chú:</strong> {{ order.orderNote }}</p>
        </div>

        <div class="card shadow-sm mb-3">
            <div class="card-header">
                <strong>Sản phẩm</strong>
            </div>
            <ul class="list-group list-group-flush">
                <li v-for="item in order.items" :key="item.productVariantId"
                    class="list-group-item d-flex align-items-start gap-3">
                    <img :src="item.product.productImage" alt="Ảnh sản phẩm"
                        style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px" />
                    <div class="flex-grow-1">
                        <div><strong>{{ item.product.productName }}</strong> (Size: {{ item.product.productSize }})
                        </div>
                        <div class="text-muted">Số lượng: {{ item.quantity }}</div>
                        <div class="text-muted">Đơn giá: {{ formatPrice(item.unitPrice) }}đ</div>
                    </div>
                    <div class="fw-bold text-end" style="min-width: 100px">
                        {{ formatPrice(item.total) }}đ
                    </div>
                </li>
            </ul>
        </div>

        <div class="text-end mb-3">
            <strong>Tổng tiền: {{ formatPrice(order.totalAmount) }}đ</strong>
        </div>

        <div v-if="order.status === 'pending'" class="text-end">
            <button class="btn btn-danger" @click="cancelOrder">Hủy đơn hàng</button>
        </div>
        <div v-else class="text-muted text-end">
            <i>Đơn hàng không thể hủy ở trạng thái hiện tại.</i>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from 'nuxt/app'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { $toast, $repositories }: any = useNuxtApp()
const route = useRoute()
const router = useRouter()

const orderId = Number(route.params.id)
const order = ref<any | null>(null)

const fetchOrder = async () => {
    try {
        order.value = await $repositories.orderRepository.getOrderByOrderId(orderId)
    } catch (err) {
        console.error(err)
        $toast.error('Không thể tải thông tin đơn hàng.')
    }
}

const cancelOrder = async () => {
    try {
        const confirmed = confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')
        if (!confirmed) return

        await $repositories.orderRepository.updateStatusOrderByOrderId(orderId, 'cancel')
        $toast.success('Đã hủy đơn hàng thành công.')
        fetchOrder()
    } catch (err) {
        console.error(err)
        $toast.error('Hủy đơn hàng thất bại.')
    }
}

const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN')
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

onMounted(fetchOrder)
</script>
