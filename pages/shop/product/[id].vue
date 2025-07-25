<template>
    <div class="container py-5" v-if="product">
        <div class="row g-4">
            <!-- Image -->
            <div class="col-md-6">
                <img :src="product.productImage" alt="Product Image" class="img-fluid rounded shadow-sm w-100" />
            </div>

            <!-- Info -->
            <div class="col-md-6">
                <h3 class="fw-bold mb-2">{{ product.productName }}</h3>
                <p class="product-description mb-4">
                    {{ product.productDescription }}
                </p>

                <!-- Row: Size & Quantity -->
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Chọn size:</label>
                        <select class="form-select shadow-sm" v-model="selectedVariantId"
                            @change="updateSelectedVariant">
                            <option v-for="variant in product.productVariants" :key="variant.productVariantId"
                                :value="variant.productVariantId">
                                Size {{ getSizeName(variant.productSizeId) }} – {{
                                    formatPrice(variant.productVariantPrice) }}
                            </option>
                        </select>
                    </div>

                    <div class="col-md-6">
                        <label class="form-label fw-semibold">Số lượng:</label>
                        <input type="number" v-model.number="quantity" class="form-control shadow-sm" min="1" />
                    </div>
                </div>

                <div class="mb-4">
                    <span class="fw-semibold">Giá:</span>
                    <span class="fs-4 fw-bold text-success ms-2">{{ formatPrice(currentPrice) }}</span>
                </div>

                <button class="btn btn-success px-4 py-2" @click="addToCart">
                    <i class="bi bi-cart-plus me-2"></i>Thêm vào giỏ hàng
                </button>
            </div>
        </div>

        <!-- Suggested products -->
        <div class="mt-5">
            <h5 class="fw-bold mb-3">Gợi ý đồ uống khác</h5>
            <Swiper :slides-per-view="3.5" :space-between="16" :modules="[Navigation]" :grabCursor="true" navigation>
                <SwiperSlide v-for="p in suggestedProducts" :key="p.productId">
                    <div class="card p-2 shadow-sm h-100" style="cursor: pointer; width: 100%;"
                        @click="goToProduct(p.productId)">
                        <img :src="p.productImage" class="card-img-top rounded mb-2"
                            style="height: 120px; object-fit: cover;" />
                        <div>
                            <h6 class="fw-bold mb-1">{{ p.productName }}</h6>
                            <p class="product-description small mb-1">{{ p.productDescription }}</p>
                            <span class="text-success fw-semibold">{{ formatPrice(p.productVariantPrice) }}</span>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    </div>

    <div v-else class="text-center mt-5">
        <div class="spinner-border text-success" role="status">
            <span class="visually-hidden">Đang tải...</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useRouter } from 'nuxt/app'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'


const { $repositories, $toast }: any = useNuxtApp()
const router = useRouter()
const route = useRoute()
const productId = Number(route.params.id)
const userId = ref<string | null>(null)

const product = ref<any>(null)
const productSizes = ref<any[]>([])
const selectedVariantId = ref<number | null>(null)
const currentPrice = ref<number>(0)
const quantity = ref<number>(1)
const suggestedProducts = ref<any[]>([])

const fetchProductAndSizes = async () => {
    try {
        const [productData, sizeData] = await Promise.all([
            $repositories.productRepository.getProductByProductId(productId),
            $repositories.configDataRepository.fetchProductSizes()
        ])
        product.value = productData
        productSizes.value = sizeData

        if (product.value.productVariants.length > 0) {
            selectedVariantId.value = product.value.productVariants[0].productVariantId
            updateSelectedVariant()
        }
    } catch (err) { }
}

const fetchSuggestedProducts = async () => {
    const list = await $repositories.productRepository.getProductsByShopId(16)
    suggestedProducts.value = list
        .filter((p: any) => p.productId !== productId)
        .slice(0, 5)
        .map((p: any) => ({
            ...p,
            productVariantPrice: p.productVariants?.[0]?.productVariantPrice || 0
        }))
}

const updateSelectedVariant = () => {
    const variant = product.value.productVariants.find(
        (v: any) => v.productVariantId === selectedVariantId.value
    )
    if (variant) {
        currentPrice.value = variant.productVariantPrice
    }
}

const getSizeName = (sizeId: number): string => {
    const size = productSizes.value.find((s: any) => s.productSizeId === sizeId)
    return size ? size.productSizeName : `Size ${sizeId}`
}

const addToCart = async () => {
    if (!selectedVariantId.value || quantity.value < 1) {
        $toast.error('Vui lòng chọn biến thể và nhập số lượng hợp lệ!')
        return
    }

    const data = {
        productVariantId: selectedVariantId.value,
        quantity: quantity.value
    }

    try {
        await $repositories.cartRepository.addProductToCart(userId.value, data)
        $toast.success('Đã thêm vào giỏ hàng!')
    } catch (err) {
        $toast.error('Thêm vào giỏ hàng thất bại!')
    }
}

const goToProduct = (id: number) => {
    router.push(`/shop/product/${id}`)
}

const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + '₫'
}

onMounted(() => {
    if (process.client) {
        userId.value = localStorage.getItem('accountId')
        fetchProductAndSizes()
        fetchSuggestedProducts()
    }
})
</script>

<style scoped>
.product-description {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #6c757d;
    font-size: 0.95rem;
}
</style>
