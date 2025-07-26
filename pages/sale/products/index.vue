<template>
    <div class="container py-5">
        <h2 class="text-center mb-4">Thống kê sản phẩm</h2>

        <div class="row text-center mb-5">
            <div class="col-md-3 col-6 mb-3" v-for="stat in stats" :key="stat.label">
                <div class="p-3 border rounded bg-light shadow-sm">
                    <h5 class="mb-1">{{ stat.label }}</h5>
                    <p class="mb-0">{{ stat.count }} sản phẩm</p>
                </div>
            </div>
        </div>

        <div class="text-center mb-4">
            <a href="/sale/products/create" class="btn btn-primary">+ Tạo sản phẩm</a>
        </div>

        <ul class="nav nav-pills justify-content-center mb-4 gap-2">
            <li class="nav-item" v-for="tab in tabs" :key="tab.key">
                <button class="nav-link" :class="{ active: currentTab === tab.key }" @click="currentTab = tab.key">
                    {{ tab.label }}
                </button>
            </li>
        </ul>

        <div class="row">
            <template v-if="filteredProducts.length > 0">
                <div class="col-md-4 mb-4" v-for="product in filteredProducts" :key="product.productId">
                    <div class="card h-100 shadow-sm" @click="goToProductDetail(product.productId)"
                        style="cursor: pointer">
                        <img :src="product.productImage" class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">{{ product.productName }}</h5>
                            <p class="card-text">{{ product.productDescription }}</p>
                        </div>
                    </div>
                </div>
            </template>
            <p v-else class="text-center text-muted">Không có sản phẩm.</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useNuxtApp, useRouter } from 'nuxt/app'

const { $repositories }: any = useNuxtApp()
const router = useRouter()

const shopId = ref<string | null>(null)

const productActive = ref<any[]>([])
const productPending = ref<any[]>([])
const productSoldout = ref<any[]>([])
const productReject = ref<any[]>([])

const currentTab = ref('active')

const tabs = [
    { key: 'active', label: 'Đang hoạt động' },
    { key: 'pending', label: 'Chờ duyệt' },
    { key: 'soldout', label: 'Hết hàng' },
    { key: 'reject', label: 'Từ chối' }
]

const stats = computed(() => [
    { label: 'Đang hoạt động', count: productActive.value.length || 0 },
    { label: 'Chờ duyệt', count: productPending.value.length || 0 },
    { label: 'Hết hàng', count: productSoldout.value.length || 0 },
    { label: 'Từ chối', count: productReject.value.length || 0 }
])

const filteredProducts = computed(() => {
    switch (currentTab.value) {
        case 'pending':
            return productPending.value
        case 'soldout':
            return productSoldout.value
        case 'reject':
            return productReject.value
        default:
            return productActive.value
    }
})

const goToProductDetail = (productId: number) => {
    router.push(`/sale/products/${productId}`)
}

const fetchProducts = async () => {
    productActive.value = await $repositories.productRepository.getProductsByStatusNameAndShopId("active", shopId.value)
    productPending.value = await $repositories.productRepository.getProductsByStatusNameAndShopId("pending", shopId.value)
    productSoldout.value = await $repositories.productRepository.getProductsByStatusNameAndShopId("soldout", shopId.value)
    productReject.value = await $repositories.productRepository.getProductsByStatusNameAndShopId("reject", shopId.value)
}

onMounted(async () => {
  if (process.client) {
    shopId.value = localStorage.getItem('shopId')
  }
  try {
    fetchProducts()
  } catch (err) {
  }
})
</script>
<style scoped>
.card:hover {
    transform: scale(1.02);
    transition: 0.2s;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
}
</style>
