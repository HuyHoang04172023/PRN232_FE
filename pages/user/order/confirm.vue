<template>
  <div class="container py-5">
    <h3 class="fw-bold mb-4 text-primary text-center">Xác nhận đơn hàng</h3>

    <div v-if="groupedItems.length">
      <!-- Group theo cửa hàng -->
      <div v-for="(group, index) in groupedItems" :key="index" class="mb-5">
        <div class="bg-light border rounded p-3 mb-2">
          <h5 class="fw-bold text-dark mb-3">{{ group.shopName }}</h5>

          <div
            v-for="item in group.items"
            :key="item.cartItemId"
            class="d-flex border-bottom py-3 gap-3"
          >
            <img
              :src="item.productVariant.product.productImage"
              alt="product"
              class="rounded"
              style="width: 90px; height: 90px; object-fit: cover"
            />
            <div class="flex-grow-1">
              <h6 class="mb-1 fw-semibold">{{ item.productVariant.product.productName }}</h6>
              <div class="text-muted small">
                <div>Size: {{ item.productVariant.productSize.productSizeName }}</div>
                <div>Giá: {{ formatPrice(item.productVariant.productVariantPrice) }}</div>
                <div>Số lượng: x{{ item.quantity }}</div>
              </div>
            </div>
          </div>

          <div class="mt-3 text-end fw-bold fs-6">
            Tổng cộng: <span class="text-success">{{ formatPrice(group.totalPrice) }}</span>
          </div>
        </div>
      </div>

      <div class="card shadow-sm border-0">
        <div class="card-body">
          <form @submit.prevent="submitOrder">
            <div class="mb-3">
              <label class="form-label fw-medium">Địa chỉ giao hàng</label>
              <input v-model="form.shippingAddress" required type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Số điện thoại</label>
              <input v-model="form.phoneNumber" required type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label fw-medium">Ghi chú (tuỳ chọn)</label>
              <textarea v-model="form.orderNote" rows="3" class="form-control"></textarea>
            </div>
            <div class="text-end">
              <button type="submit" class="btn btn-primary px-4">Gửi đơn hàng</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted py-5">
      <p>Không có sản phẩm nào được chọn!</p>
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
