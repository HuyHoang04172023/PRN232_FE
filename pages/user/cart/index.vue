<template>
    <div class="container mt-5">
        <h3>🛒 Giỏ hàng của bạn</h3>

        <div v-if="cart?.cartItems?.length" class="row">
            <div v-for="item in cart.cartItems" :key="item.cartItemId"
                class="col-md-12 mb-3 border rounded p-3 d-flex align-items-center">
                <input type="checkbox" v-model="selectedItems" :value="item.cartItemId" class="form-check-input me-3" />

                <img :src="item.productVariant.product.productImage" alt="Product Image" class="img-thumbnail me-3"
                    style="width: 80px; height: 80px; object-fit: cover;" />

                <div class="flex-grow-1">
                    <h5 class="mb-1">{{ item.productVariant.product.productName }}</h5>
                    <p class="mb-1 text-muted">
                        Size: {{ item.productVariant.productSize.productSizeName }}
                    </p>
                    <p class="mb-1 text-success fw-bold">
                        {{ formatPrice(item.productVariant.productVariantPrice) }}
                    </p>
                </div>

                <div class="d-flex align-items-center me-3">
                    <button class="btn btn-outline-secondary btn-sm" @click="changeQuantity(item, -1)">−</button>
                    <span class="mx-2">{{ item.quantity }}</span>
                    <button class="btn btn-outline-secondary btn-sm" @click="changeQuantity(item, 1)">+</button>
                </div>

                <button class="btn btn-danger btn-sm" @click="removeItem(item)">Xóa</button>
            </div>
        </div>

        <div v-else class="text-muted mt-3">🪶 Giỏ hàng đang trống.</div>

        <div v-if="cart?.cartItems?.length" class="mt-4 text-end">
            <button class="btn btn-success" @click="createOrder">
                🧾 Tạo đơn hàng (console)
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from 'nuxt/app'
import { ref, onMounted } from 'vue'

const { $repositories, $toast }: any = useNuxtApp()

const userId = ref<string | null>(null)
const cart = ref<any>(null)
const selectedItems = ref<number[]>([])

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

    console.log('🧾 Dữ liệu tạo đơn hàng:')
    console.log(
        selectedProducts.map((item: any) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity
        }))
    )
}

onMounted(() => {
    if (process.client) {
        userId.value = localStorage.getItem('accountId')
        fetchCart()
    }
})

// Format tiền
const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + '₫'
}
</script>
