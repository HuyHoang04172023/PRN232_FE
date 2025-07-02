<template>
    <div class="container mt-5" v-if="product">
        <div class="row">
            <!-- Hình ảnh sản phẩm -->
            <div class="col-md-5">
                <img :src="getImageUrl(product.productImage)" alt="Product Image" class="img-fluid rounded" />
            </div>

            <!-- Thông tin sản phẩm -->
            <div class="col-md-7">
                <h2>{{ product.productName }}</h2>
                <p class="text-muted">{{ product.productDescription }}</p>

                <!-- Biến thể -->
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

                <!-- Giá -->
                <div class="mb-3">
                    <strong>Giá:</strong>
                    <span class="fs-5 text-success">
                        {{ formatPrice(currentPrice) }}
                    </span>
                </div>

                <!-- Nút thêm vào giỏ hàng -->
                <button class="btn btn-primary" @click="addToCart">
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    </div>

    <!-- Loading -->
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

const { $repositories }: any = useNuxtApp();
const route = useRoute();
const productId = Number(route.params.id);

const product = ref<any>(null);
const productSizes = ref<any[]>([]);
const selectedVariantId = ref<number | null>(null);
const currentPrice = ref<number>(0);

// Fetch product + size data
const fetchProductAndSizes = async () => {
    try {
        // Gọi đồng thời 2 API
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
        console.error('Lỗi khi tải dữ liệu:', err);
    }
};

// Cập nhật giá theo biến thể được chọn
const updateSelectedVariant = () => {
    const variant = product.value.productVariants.find(
        (v: any) => v.productVariantId === selectedVariantId.value
    );
    if (variant) {
        currentPrice.value = variant.productVariantPrice;
    }
};

// Hiển thị tên size theo ID
const getSizeName = (sizeId: number): string => {
    const size = productSizes.value.find((s: any) => s.productSizeId === sizeId);
    return size ? size.productSizeName : `Size ${sizeId}`;
};

// Hàm xử lý khi thêm vào giỏ hàng
const addToCart = () => {
    const selectedVariant = product.value.productVariants.find(
        (v: any) => v.productVariantId === selectedVariantId.value
    );
    console.log('Thêm vào giỏ hàng:', {
        productId: product.value.productId,
        productName: product.value.productName,
        selectedVariant,
    });
};

// Định dạng giá tiền
const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + '₫';
};

// Xử lý ảnh nếu là đường dẫn tương đối
const getImageUrl = (path: string): string => {
    const baseUrl = 'https://your-api-domain.com'; // Thay bằng domain thực tế của bạn
    return path.startsWith('/') ? baseUrl + path : path;
};

onMounted(fetchProductAndSizes);
</script>
