<template>
    <div class="container mt-5">
        <h3>🧾 Xác nhận đơn hàng</h3>

        <div v-if="groupedItems.length">
            <div v-for="(group, index) in groupedItems" :key="index" class="mb-4 border rounded p-3">
                <h5>🛍️ {{ group.shopName }}</h5>
                <div v-for="item in group.items" :key="item.cartItemId"
                    class="d-flex align-items-center border-bottom py-2">
                    <img :src="item.productVariant.product.productImage" alt="product" class="img-thumbnail me-3"
                        style="width: 80px; height: 80px; object-fit: cover;" />
                    <div class="flex-grow-1">
                        <strong>{{ item.productVariant.product.productName }}</strong><br />
                        <small>Size: {{ item.productVariant.productSize.productSizeName }}</small><br />
                        <small>Giá: {{ formatPrice(item.productVariant.productVariantPrice) }}</small><br />
                        <small>Số lượng: {{ item.quantity }}</small>
                    </div>
                </div>
                <p class="mt-2 text-end fw-bold">
                    Tổng: {{ formatPrice(group.totalPrice) }}
                </p>
            </div>

            <form @submit.prevent="submitOrder">
                <div class="mb-3">
                    <label class="form-label">Địa chỉ giao hàng</label>
                    <input v-model="form.shippingAddress" required type="text" class="form-control" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Số điện thoại</label>
                    <input v-model="form.phoneNumber" required type="text" class="form-control" />
                </div>
                <div class="mb-3">
                    <label class="form-label">Ghi chú</label>
                    <textarea v-model="form.orderNote" class="form-control"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">🚀 Gửi đơn hàng</button>
            </form>
        </div>
        <div v-else>
            <p class="text-muted">Không có sản phẩm nào được chọn!</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useState, useRouter, useNuxtApp } from 'nuxt/app'
import { ref, computed } from 'vue'

const { $repositories, $toast }: any = useNuxtApp()
const router = useRouter()

const orderState = useState<any>('order-cart')

const form = ref({
    shippingAddress: '',
    phoneNumber: '',
    orderNote: ''
})

const groupedItems = computed(() => {
    const map = new Map()

    if (!orderState.value?.items?.length) return []

    orderState.value.items.forEach((item: any) => {
        const shopId = item.productVariant.product.shopId
        if (!map.has(shopId)) {
            map.set(shopId, {
                shopId,
                shopName: item.productVariant.product.shopName,
                items: [],
                totalPrice: 0
            })
        }

        const group = map.get(shopId)
        group.items.push(item)
        group.totalPrice += item.quantity * item.productVariant.productVariantPrice
    })

    return Array.from(map.values())
})

const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + '₫'
}

const submitOrder = async () => {
    try {
        for (const group of groupedItems.value) {
            const payload = {
                userId: orderState.value.userId,
                shopId: group.shopId,
                shippingAddress: form.value.shippingAddress,
                phoneNumber: form.value.phoneNumber,
                orderNote: form.value.orderNote,
                items: group.items.map((item: any) => ({
                    productVariantId: item.productVariantId,
                    quantity: item.quantity
                }))
            }

            console.log('Gửi đến API:', payload)
            await $repositories.orderRepository.createOrder(payload)
        }

        $toast.success('Đơn hàng đã được tạo!')
        router.push('/')
    } catch (err) {
        console.error('Lỗi tạo đơn hàng:', err)
        $toast.error('Tạo đơn hàng thất bại!')
    }
}
</script>
