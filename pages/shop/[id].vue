<template>
    <div class="container py-4">
        <h2 class="fw-bold mb-2">{{ shopInfo.shopName }}</h2>
        <p class="text-muted mb-2">{{ shopInfo.shopDescription }}</p>

        <div class="d-flex align-items-center mb-2 flex-wrap gap-3">
            <span class="text-warning fw-bold"><i class="bi bi-star-fill"></i> 4.8</span>
            <span><i class="bi bi-clock"></i> 25 phút</span>
            <span><i class="bi bi-geo-alt"></i> 1,2 km</span>
        </div>

        <div class="mb-2">
            <strong>Giờ mở cửa</strong> Hôm nay 05:30 - 22:00
        </div>

        <div class="mb-3">
            <div class="text-success"><i class="bi bi-ticket-perforated-fill me-2"></i>Giảm 5.000₫ phí giao hàng khi đặt
                đơn tối thiểu 100.000₫</div>
            <div class="text-success"><i class="bi bi-ticket-perforated-fill me-2"></i>Tận hưởng ưu đãi</div>
        </div>

        <div class="d-flex flex-wrap gap-3 mb-4">
            <div class="form-control w-auto d-flex align-items-center gap-2">
                <i class="bi bi-calendar3"></i> Ngày giao hàng: Hôm nay
            </div>
            <div class="form-control w-auto d-flex align-items-center gap-2">
                <i class="bi bi-clock-history"></i> Thời gian giao: Ngay bây giờ
            </div>
        </div>

        <div class="row">
            <div v-for="product in products" :key="product.productId" class="col-md-4 mb-4">
                <div class="border rounded p-3 h-100 d-flex flex-column justify-content-between"
                    @click="goToProduct(product.productId)" style="cursor: pointer;">
                    <div class="d-flex">
                        <img :src="product.productImage" alt="Product" class="me-3 rounded"
                            style="width: 80px; height: 80px; object-fit: cover;" />
                        <div>
                            <h6 class="fw-bold">{{ product.productName }}</h6>
                            <p class="product-description">
                                {{ product.productDescription }}
                            </p>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="fw-bold">{{ product.productVariantPrice?.toLocaleString() }}₫</span>
                        <button class="btn btn-outline-success btn-sm rounded-circle">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp, useRouter } from 'nuxt/app'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const { $repositories }: any = useNuxtApp()
const router = useRouter()
const route = useRoute()
const shopId = Number(route.params.id)

const shopInfo = ref<any>({})
const products = ref<any[]>([])

const goToProduct = (productId: number) => {
    router.push(`/shop/product/${productId}`)
}

const fetchData = async () => {
    shopInfo.value = await $repositories.shopRepository.getShopInfoByShopId(shopId)
    const result = await $repositories.productRepository.getProductsByShopId(shopId)
    products.value = result.map((p: any) => ({
        ...p,
        productVariantPrice: p.productVariants?.[0]?.productVariantPrice || 0,
    }))
}

onMounted(fetchData)
</script>

<style scoped>
.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.product-description {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.9rem;
    color: #6c757d;
}
</style>
