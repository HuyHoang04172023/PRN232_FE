<template>
    <div class="container py-4">
        <h2 class="text-center mb-4">Thống kê sản phẩm</h2>

        <!-- Tổng số sản phẩm -->
        <div class="row text-center mb-5">
            <div class="col-md-3 col-6 mb-3">
                <div class="p-3 border rounded bg-light shadow-sm">
                    <h5 class="mb-1">Active</h5>
                    <p class="mb-0">{{ productActive.length || 0 }} sản phẩm</p>
                </div>
            </div>
            <div class="col-md-3 col-6 mb-3">
                <div class="p-3 border rounded bg-light shadow-sm">
                    <h5 class="mb-1">Pending</h5>
                    <p class="mb-0">{{ productPending.length || 0 }} sản phẩm</p>
                </div>
            </div>
            <div class="col-md-3 col-6 mb-3">
                <div class="p-3 border rounded bg-light shadow-sm">
                    <h5 class="mb-1">Soldout</h5>
                    <p class="mb-0">{{ productSoldout.length || 0 }} sản phẩm</p>
                </div>
            </div>
            <div class="col-md-3 col-6 mb-3">
                <div class="p-3 border rounded bg-light shadow-sm">
                    <h5 class="mb-1">Reject</h5>
                    <p class="mb-0">{{ productReject.length || 0 }} sản phẩm</p>
                </div>
            </div>
        </div>

        <!-- Danh sách sản phẩm Active -->
        <h4 class="mb-3">Sản phẩm đang hoạt động</h4>
        <div class="row">
            <template v-if="productActive.length > 0">
                <div class="col-md-4 mb-4" v-for="product in productActive" :key="product.productId">
                    <div class="card h-100 shadow-sm" @click="goToProductDetail(product.productId)"
                        style="cursor: pointer;">
                        <img :src="product.productImage" class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">{{ product.productName }}</h5>
                            <p class="card-text">{{ product.productDescription }}</p>
                        </div>
                    </div>
                </div>
            </template>
            <p v-else class="text-muted">Không có sản phẩm.</p>
        </div>

        <!-- Danh sách sản phẩm Pending -->
        <h4 class="mt-5 mb-3">Sản phẩm chờ duyệt</h4>
        <div class="row">
            <template v-if="productPending.length > 0">
                <div class="col-md-4 mb-4" v-for="product in productPending" :key="product.productId">
                    <div class="card h-100 shadow-sm" @click="goToProductDetail(product.productId)"
                        style="cursor: pointer;">
                        <img :src="product.productImage" class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">{{ product.productName }}</h5>
                            <p class="card-text">{{ product.productDescription }}</p>
                        </div>
                    </div>
                </div>
            </template>
            <p v-else class="text-muted">Không có sản phẩm.</p>
        </div>

        <!-- Danh sách sản phẩm Soldout -->
        <h4 class="mt-5 mb-3">Sản phẩm hết hàng</h4>
        <div class="row">
            <template v-if="productSoldout.length > 0">
                <div class="col-md-4 mb-4" v-for="product in productSoldout" :key="product.productId">
                    <div class="card h-100 shadow-sm" @click="goToProductDetail(product.productId)"
                        style="cursor: pointer;">
                        <img :src="product.productImage" class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">{{ product.productName }}</h5>
                            <p class="card-text">{{ product.productDescription }}</p>
                        </div>
                    </div>
                </div>
            </template>
            <p v-else class="text-muted">Không có sản phẩm.</p>
        </div>

        <!-- Danh sách sản phẩm Reject -->
        <h4 class="mt-5 mb-3">Sản phẩm bị từ chối</h4>
        <div class="row">
            <template v-if="productReject.length > 0">
                <div class="col-md-4 mb-4" v-for="product in productReject" :key="product.productId">
                    <div class="card h-100 shadow-sm" @click="goToProductDetail(product.productId)"
                        style="cursor: pointer;">
                        <img :src="product.productImage" class="card-img-top" alt="..." />
                        <div class="card-body">
                            <h5 class="card-title">{{ product.productName }}</h5>
                            <p class="card-text">{{ product.productDescription }}</p>
                        </div>
                    </div>
                </div>
            </template>
            <p v-else class="text-muted">Không có sản phẩm.</p>
        </div>
    </div>
</template>


<script setup lang="ts">
import { useNuxtApp, useRouter } from 'nuxt/app';
import { ref, onMounted } from 'vue'
const { $toast, $repositories }: any = useNuxtApp();
const router = useRouter();

const productActive = ref<any[]>([]);
const productPending = ref<any[]>([]);
const productSoldout = ref<any[]>([]);
const productReject = ref<any[]>([]);

const fetchShops = async () => {
    try {
        productActive.value = await $repositories.productRepository.getProductsByStatusName("active");
        productPending.value = await $repositories.productRepository.getProductsByStatusName("pending");
        productSoldout.value = await $repositories.productRepository.getProductsByStatusName("soldout");
        productReject.value = await $repositories.productRepository.getProductsByStatusName("reject");
    } catch (err) {
    }
}


const goToProductDetail = (productId: number) => {
    router.push(`/sale/products/${productId}`);
}

onMounted(fetchShops)

</script>
<style scoped>
.card:hover {
    transform: scale(1.02);
    transition: 0.2s;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
}
</style>
