<template>
    <div class="container mt-5" v-if="product">
        <div class="row">
            <div class="col-md-5">
                <img :src="product.productImage" alt="Product Image" class="img-fluid rounded" />
            </div>

            <div class="col-md-7">
                <h2>{{ product.productName }}</h2>
                <p class="text-muted">{{ product.productDescription }}</p>

                <div class="mb-3">
                    <label class="form-label">Chọn kích cỡ / biến thể:</label>
                    <select class="form-select" v-model="selectedVariantId" @change="updateSelectedVariant">
                        <option v-for="variant in product.productVariants" :key="variant.productVariantId"
                            :value="variant.productVariantId">
                            Size {{ getSizeName(variant.productSizeId) }} - {{ formatPrice(variant.productVariantPrice)
                            }}
                        </option>
                    </select>
                </div>

                <div class="mb-3">
                    <label class="form-label">Số lượng:</label>
                    <input type="number" v-model.number="quantity" class="form-control" min="1" />
                </div>

                <div class="mb-3">
                    <strong>Giá:</strong>
                    <span class="fs-5 text-success">
                        {{ formatPrice(currentPrice) }}
                    </span>
                </div>

                <button class="btn btn-primary" @click="addToCart">
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    </div>

    <div v-else class="text-center mt-5">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from 'nuxt/app';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const { $repositories, $toast }: any = useNuxtApp();
const route = useRoute();
const productId = Number(route.params.id);
const userId = ref<string | null>(null);

const product = ref<any>(null);
const productSizes = ref<any[]>([]);
const selectedVariantId = ref<number | null>(null);
const currentPrice = ref<number>(0);
const quantity = ref<number>(1);

const fetchProductAndSizes = async () => {
    try {
        const [productData, sizeData] = await Promise.all([
            $repositories.productRepository.getProductByProductId(productId),
            $repositories.configDataRepository.fetchProductSizes(),
        ]);

        product.value = productData;
        productSizes.value = sizeData;

        if (product.value.productVariants.length > 0) {
            selectedVariantId.value = product.value.productVariants[0].productVariantId;
            updateSelectedVariant();
        }
    } catch (err) {
    }
};

const updateSelectedVariant = () => {
    const variant = product.value.productVariants.find(
        (v: any) => v.productVariantId === selectedVariantId.value
    );
    if (variant) {
        currentPrice.value = variant.productVariantPrice;
    }
};

const getSizeName = (sizeId: number): string => {
    const size = productSizes.value.find((s: any) => s.productSizeId === sizeId);
    return size ? size.productSizeName : `Size ${sizeId}`;
};

const addToCart = async () => {
    if (!selectedVariantId.value || quantity.value < 1) {
        $toast.error('Vui lòng chọn biến thể và nhập số lượng hợp lệ!');
        return;
    }

    const data = {
        productVariantId: selectedVariantId.value,
        quantity: quantity.value
    };

    try {
        await $repositories.cartRepository.addProductToCart(userId.value, data);
        $toast.success('Đã thêm vào giỏ hàng!');
    } catch (err) {
        $toast.error('Thêm vào giỏ hàng thất bại!');
    }
};

const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + '₫';
};

onMounted(() => {
    if (process.client) {
        userId.value = localStorage.getItem('accountId');
        fetchProductAndSizes();
    }
});
</script>
