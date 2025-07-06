<template>
    <div class="container py-4" v-if="order">
        <h2 class="mb-4">Chi tiết đơn hàng #{{ order.orderId }}</h2>

        <div class="mb-3">
            <p><strong>Ngày đặt:</strong> {{ formatDate(order.createdAt) }}</p>
            <p><strong>Khách hàng:</strong> {{ order.customer.userName }} ({{ order.customer.email }})</p>
            <p><strong>Địa chỉ giao hàng:</strong> {{ order.shippingAddress }}</p>
            <p><strong>SĐT:</strong> {{ order.phoneNumber }}</p>
            <p><strong>Ghi chú:</strong> {{ order.orderNote }}</p>
            <p><strong>Trạng thái hiện tại:</strong>
                <span :class="statusClass(order.status)">
                    {{ convertStatus(order.status) }}
                </span>
            </p>
        </div>

        <div class="card shadow-sm mb-3">
            <div class="card-header"><strong>Sản phẩm</strong></div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex align-items-start gap-3" v-for="item in order.items"
                    :key="item.productVariantId">
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

        <div class="text-end mb-4">
            <strong>Tổng tiền: {{ formatPrice(order.totalAmount) }}đ</strong>
        </div>

        <div v-if="order.status !== 'cancel' && order.status !== 'success'" class="card p-3 shadow-sm mb-4">
            <label for="statusSelect" class="form-label"><strong>Cập nhật trạng thái đơn hàng:</strong></label>
            <select id="statusSelect" class="form-select" v-model="selectedStatus">
                <option v-for="status in statusOptions" :key="status.statusOrderId" :value="status.statusOrderName">
                    {{ convertStatus(status.statusOrderName) }}
                </option>
            </select>
            <button class="btn btn-primary mt-3" @click="updateStatus">Cập nhật</button>
        </div>

        <div v-else class="alert alert-secondary text-center mt-4">
            <strong>
                Đơn hàng đã {{ order.status === 'cancel' ? 'bị hủy' : 'hoàn thành' }} và không thể cập nhật trạng thái.
            </strong>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from 'nuxt/app'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const { $toast, $repositories }: any = useNuxtApp()
const route = useRoute()

const orderId = Number(route.params.id)
const order = ref<any | null>(null)
const statusOptions = ref<any[]>([])
const selectedStatus = ref<string>('')

const fetchOrder = async () => {
    try {
        order.value = await $repositories.orderRepository.getOrderByOrderId(orderId)
        selectedStatus.value = order.value.status
    } catch (err) {
        console.error(err)
        $toast.error('Không thể tải thông tin đơn hàng.')
    }
}

const fetchStatusOrder = async () => {
    try {
        statusOptions.value = await $repositories.configDataRepository.fetchStatusOrders()
    } catch (err) {
        console.error(err)
        $toast.error('Không thể tải danh sách trạng thái đơn hàng.')
    }
}

const updateStatus = async () => {
    try {
        await $repositories.orderRepository.updateStatusOrderByOrderId(orderId, selectedStatus.value)
        $toast.success('Cập nhật trạng thái thành công.')
        fetchOrder()
    } catch (err) {
        console.error(err)
        $toast.error('Cập nhật thất bại.')
    }
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

const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN')
}

const convertStatus = (status: string) => {
    switch (status) {
        case 'pending':
            return 'Chờ xác nhận'
        case 'doing':
            return 'Đang chuẩn bị'
        case 'shipping':
            return 'Đang giao hàng'
        case 'cancel':
            return 'Đã hủy'
        case 'success':
            return 'Hoàn thành'
        default:
            return status
    }
}

const statusClass = (status: string) => {
    switch (status) {
        case 'pending':
            return 'badge bg-warning text-dark'
        case 'doing':
            return 'badge bg-info'
        case 'shipping':
            return 'badge bg-primary'
        case 'cancel':
            return 'badge bg-danger'
        case 'success':
            return 'badge bg-success'
        default:
            return 'badge bg-secondary'
    }
}

onMounted(() => {
    fetchOrder()
    fetchStatusOrder()
})
</script>
