<template>
    <div class="container mt-5">
        <h3>🛒 Giỏ hàng của bạn</h3>

        <div v-if="groupedCartItems.length">
            <div v-for="(group, index) in groupedCartItems" :key="index" class="mb-4 border rounded p-3">
                <h5>🛍️ {{ group.shopName }}</h5>
                <div v-for="item in group.items" :key="item.cartItemId"
                    class="row align-items-center border-bottom py-2">
                    <div class="col-auto">
                        <input type="checkbox" v-model="selectedItems" :value="item.cartItemId"
                            class="form-check-input" />
                    </div>

                    <div class="col-auto">
                        <img :src="item.productVariant.product.productImage" alt="Product Image" class="img-thumbnail"
                            style="width: 80px; height: 80px; object-fit: cover;" />
                    </div>

                    <div class="col">
                        <h5 class="mb-1">{{ item.productVariant.product.productName }}</h5>
                        <p class="mb-1 text-muted">Size: {{ item.productVariant.productSize.productSizeName }}</p>
                        <p class="mb-1 text-success fw-bold">{{ formatPrice(item.productVariant.productVariantPrice) }}
                        </p>
                    </div>

                    <div class="col-auto d-flex align-items-center">
                        <button class="btn btn-outline-secondary btn-sm" @click="changeQuantity(item, -1)">−</button>
                        <span class="mx-2">{{ item.quantity }}</span>
                        <button class="btn btn-outline-secondary btn-sm" @click="changeQuantity(item, 1)">+</button>
                    </div>

                    <div class="col-auto">
                        <button class="btn btn-danger btn-sm" @click="removeItem(item)">Xóa</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-muted mt-3">🪶 Giỏ hàng đang trống.</div>

        <div v-if="cart?.cartItems?.length" class="mt-4 text-end">
            <button class="btn btn-success" @click="createOrder">
                🧾 Tạo đơn hàng
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useRouter } from 'nuxt/app'
import { ref, onMounted, computed } from 'vue'
import { useState } from '#app'

const { $repositories, $toast }: any = useNuxtApp()
const router = useRouter()

const userId = ref<string | null>(null)
const cart = ref<any>(null)
const selectedItems = ref<number[]>([])
const orderState = useState<any>('order-cart', () => ({ items: [], userId: '' }))

const fetchCart = async () => {
    if (!userId.value) return
    try {
        const result = await $repositories.cartRepository.getCartBByUserId(userId.value)
        cart.value = result
    } catch (err) {
        console.error('Lỗi khi lấy giỏ hàng:', err)
    }
}

const changeQuantity = async (item: any, delta: number) => {
    const newQty = item.quantity + delta
    if (newQty < 1) return

    try {
        const data = {
            productVariantId: item.productVariantId,
            quantity: newQty
        }
        await $repositories.cartRepository.updateProductInCart(userId.value, data)
        item.quantity = newQty
    } catch (err) {
        console.error('Lỗi khi cập nhật số lượng:', err)
        $toast.error('Cập nhật thất bại')
    }
}

const removeItem = async (item: any) => {
    try {
        await $repositories.cartRepository.deleteProductInCart(userId.value, item.productVariantId)
        cart.value.cartItems = cart.value.cartItems.filter(
            (i: any) => i.cartItemId !== item.cartItemId
        )
        selectedItems.value = selectedItems.value.filter(id => id !== item.cartItemId)
        $toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
    } catch (err) {
        console.error('Xóa sản phẩm lỗi:', err)
        $toast.error('Xóa sản phẩm thất bại')
    }
}

const createOrder = () => {
    const selectedProducts = cart.value.cartItems.filter((item: any) =>
        selectedItems.value.includes(item.cartItemId)
    )

    if (selectedProducts.length === 0) {
        $toast.warning('Vui lòng chọn ít nhất một sản phẩm!')
        return
    }

    orderState.value = {
        items: selectedProducts,
        userId: userId.value
    }

    router.push('/user/order/confirm')
}

const groupedCartItems = computed(() => {
    if (!cart.value || !cart.value.cartItems) return []

    const groups = new Map()
    for (const item of cart.value.cartItems) {
        const shopId = item.productVariant.product.shopId
        if (!groups.has(shopId)) {
            groups.set(shopId, {
                shopId,
                shopName: item.productVariant.product.shopName,
                items: []
            })
        }
        groups.get(shopId).items.push(item)
    }
    return Array.from(groups.values())
})

const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + '₫'
}

onMounted(() => {
    if (process.client) {
        userId.value = localStorage.getItem('accountId')
        fetchCart()
    }
})
</script>
