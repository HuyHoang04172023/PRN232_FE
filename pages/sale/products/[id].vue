<template>
    <div class="container py-4" v-if="productData">
        <h2 class="mb-3">Chỉnh sửa sản phẩm</h2>

        <div class="mb-4">
            <label class="form-label">Tên sản phẩm</label>
            <input v-model="productData.productName" class="form-control" />

            <label class="form-label mt-3">Mô tả</label>
            <textarea v-model="productData.productDescription" class="form-control" rows="3"></textarea>

            <label class="form-label mt-3">Ảnh sản phẩm</label>
            <input v-model="productData.productImage" class="form-control" />
            <input type="file" class="form-control" @change="handleImageUpload" accept="image/*" />
            <div v-if="previewUrl" class="mt-2">
                <img :src="previewUrl" alt="Preview" class="img-thumbnail" style="max-height: 200px;" />
            </div>
        </div>

        <h4 class="mt-5">Các biến thể sản phẩm</h4>
        <button class="btn btn-outline-success mb-3" @click="addProductVariant">
            + Thêm biến thể sản phẩm
        </button>
        <div class="card p-3 mb-3" v-for="(variant, index) in productData.productVariants"
            :key="variant.productVariantId">
            <div class="row align-items-center">
                <div class="col-md-5">
                    <label class="form-label">Size</label>
                    <select v-model="variant.productSizeId" class="form-select">
                        <option v-for="size in productSizes" :key="size.productSizeId" :value="size.productSizeId">
                            {{ size.productSizeName }}
                        </option>
                    </select>
                </div>

                <div class="col-md-5">
                    <label class="form-label">Giá</label>
                    <input type="number" v-model.number="variant.productVariantPrice" class="form-control" />
                </div>

                <div class="col-md-2 d-flex align-items-end">
                    <button class="btn btn-danger w-100" @click="removeProductVariant(index)">
                        Xoá
                    </button>
                </div>
            </div>

        </div>

        <button class="btn btn-primary mt-3" @click="updateProduct">
            Lưu thay đổi
        </button>
    </div>

    <div v-else class="text-center py-5">
        <p>Đang tải dữ liệu sản phẩm...</p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const { $toast, $repositories }: any = useNuxtApp()
const route = useRoute()
const productId = Number(route.params.id)

const productData = ref<any>(null)
const productSizes = ref<any[]>([])
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

const fetchProduct = async () => {
    try {
        productData.value = await $repositories.productRepository.getProductByProductId(productId)
        productSizes.value = await $repositories.configDataRepository.fetchProductSizes()

        previewUrl.value = productData.value.productImage // ảnh hiện tại
    } catch (err) {
        $toast.error("Không thể tải sản phẩm.")
    }
}

const handleImageUpload = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        selectedFile.value = target.files[0]
        previewUrl.value = URL.createObjectURL(selectedFile.value)
    }
}

const updateProduct = async () => {
    const userId = Number(localStorage.getItem('accountId')) || 0
    let imageUrl = productData.value.productImage

    try {
        // Nếu có file mới được chọn thì upload ảnh
        if (selectedFile.value) {
            const formData = new FormData()
            formData.append('image', selectedFile.value)

            const uploadResponse = await $fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            imageUrl = uploadResponse.imageUrl
        }

        const updatePayload = {
            productName: productData.value.productName,
            productDescription: productData.value.productDescription,
            productImage: imageUrl,
            createdBy: userId,
            productVariants: productData.value.productVariants.map((variant: any) => ({
                productSizeId: variant.productSizeId,
                productVariantPrice: variant.productVariantPrice
            }))
        }

        await $repositories.productRepository.updateProductByProductId(productId, updatePayload)
        $toast.success("Cập nhật sản phẩm thành công!")
    } catch (err) {
        $toast.error("Cập nhật sản phẩm thất bại!")

        if (selectedFile.value && imageUrl && imageUrl !== productData.value.productImage) {
            try {
                await $fetch('/api/image', {
                    method: 'DELETE',
                    body: { imageUrl }
                })
                console.warn("Đã xoá ảnh mới do cập nhật thất bại.")
            } catch (deleteErr) {
                console.warn("Không thể xóa ảnh:", deleteErr)
            }
        }
    }
}

const addProductVariant = () => {
    productData.value.productVariants.push({
        productSizeId: null,
        productVariantPrice: 0
    })
}

const removeProductVariant = (index: number) => {
    if (confirm('Bạn có chắc muốn xoá biến thể này không?')) {
        productData.value.productVariants.splice(index, 1)
    }
}

onMounted(fetchProduct)
</script>



<style scoped>
.card:hover {
    transform: scale(1.02);
    transition: 0.2s;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
}
</style>
