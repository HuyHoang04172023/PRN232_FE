<template>
    <div class="container py-5" v-if="productData">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-bold">Chỉnh sửa sản phẩm</h2>
            <button class="btn btn-outline-danger" @click="deleteProduct">Xoá sản phẩm</button>
        </div>

        <form @submit.prevent="updateProduct" class="bg-light p-4 rounded shadow-sm border">
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label">Tên sản phẩm</label>
                    <input v-model="productData.productName" class="form-control" required />
                </div>
                <div class="col-md-6">
                    <label class="form-label">Mô tả</label>
                    <textarea v-model="productData.productDescription" class="form-control" rows="3" required />
                </div>
            </div>

            <div class="mb-4">
                <label class="form-label">Ảnh sản phẩm</label>
                <input v-model="productData.productImage" class="form-control mb-2" placeholder="Link ảnh trực tiếp" />
                <input type="file" class="form-control" @change="handleImageUpload" accept="image/*" />
                <div v-if="previewUrl" class="mt-3 border p-2 text-center bg-white rounded">
                    <label class="form-label fw-semibold">Xem trước ảnh:</label><br />
                    <img :src="previewUrl" alt="Preview" class="img-fluid"
                        style="max-height: 200px; object-fit: contain;" />
                </div>
            </div>

            <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="mb-0">Các biến thể sản phẩm</h5>
                    <button class="btn btn-outline-secondary btn-sm" type="button" @click="addProductVariant">
                        + Thêm biến thể
                    </button>
                </div>

                <div class="card p-3 mb-3" v-for="(variant, index) in productData.productVariants"
                    :key="variant.productVariantId ?? index">
                    <div class="row align-items-end gx-3">
                        <div class="col-md-5">
                            <label class="form-label">Size</label>
                            <select v-model="variant.productSizeId" class="form-select" required>
                                <option disabled value="">-- Chọn size --</option>
                                <option v-for="size in productSizes" :key="size.productSizeId"
                                    :value="size.productSizeId">
                                    {{ size.productSizeName }}
                                </option>
                            </select>
                        </div>

                        <div class="col-md-5">
                            <label class="form-label">Giá</label>
                            <input type="number" v-model.number="variant.productVariantPrice" class="form-control"
                                required />
                        </div>

                        <div class="col-md-2">
                            <button class="btn btn-outline-danger w-100 mt-2" type="button"
                                @click="removeProductVariant(index)">
                                Xoá
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-center">
                <button class="btn btn-primary px-4" type="submit">Lưu thay đổi</button>
            </div>
        </form>
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

const deleteProduct = async () => {
    if (!confirm('Bạn có chắc chắn muốn xoá sản phẩm này?')) return;

    try {
        await $repositories.productRepository.deleteProductByProductId(productId)
        $toast.success("Đã xoá sản phẩm thành công!")
        navigateTo('/sale/products')
    } catch (err) {
        $toast.error("Xoá sản phẩm thất bại!")
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
