<template>
    <div class="container mt-4">
        <div class="row">
            <div v-for="product in products" :key="product.productId" class="col-md-4 mb-4">
                <div class="card h-100 d-flex flex-row" @click="goToProduct(product.productId)"
                    style="cursor: pointer;">
                    <img :src="product.productImage" class="img-fluid rounded-start" alt="Product Image"
                        style="width: 40%; object-fit: cover;" />
                    <div class="card-body d-flex flex-column justify-content-between" style="width: 60%;">
                        <div>
                            <h5 class="card-title mb-2">{{ product.productName }}</h5>
                            <p class="card-text text-truncate">
                                {{ product.productDescription }}
                            </p>
                        </div>
                        <p class="card-text">
                            <small class="text-muted">
                                Đã bán: {{ product.productSoldCount }} | Lượt thích: {{ product.productLike }}
                            </small>
                        </p>
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

const { $toast, $repositories }: any = useNuxtApp()
const router = useRouter()
const route = useRoute()

const shopId = Number(route.params.id)
const products = ref<any[]>([])

const fetchProducts = async () => {
    try {
        products.value = await $repositories.productRepository.getProductsByShopId(shopId)
    } catch (err) {
        console.error(err)
    }
}

const goToProduct = (productId: number) => {
    router.push(`/shop/product/${productId}`)
}

onMounted(fetchProducts)
</script>
