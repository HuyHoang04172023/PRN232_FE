<template>
  <div class="container py-5" style="max-width: 800px">
    <h2 class="text-center mb-4">Tạo sản phẩm mới</h2>

    <form @submit.prevent="handleSubmit" class="bg-light p-4 rounded shadow-sm border">

      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Tên sản phẩm</label>
          <input v-model="product.productName" type="text" class="form-control" required />
        </div>
        <div class="col-md-6">
          <label class="form-label">Mô tả sản phẩm</label>
          <textarea v-model="product.productDescription" class="form-control" rows="3" required />
        </div>
      </div>

      <div class="mb-4">
        <label class="form-label">Ảnh sản phẩm</label>
        <input type="file" class="form-control" @change="handleImageUpload" accept="image/*" />
        <div v-if="previewUrl" class="mt-3 border p-3 rounded text-center bg-white">
          <label class="form-label mb-2 fw-semibold">Xem trước ảnh:</label><br />
          <img :src="previewUrl" alt="Preview" class="img-fluid" style="max-height: 200px; object-fit: contain;" />
        </div>
      </div>

      <div class="mb-4">
        <label class="form-label">Biến thể sản phẩm</label>

        <div v-for="(variant, index) in product.productVariants" :key="index" class="row gx-2 align-items-center mb-2">
          <div class="col-md-5">
            <input v-model.number="variant.productVariantPrice" type="number" class="form-control" placeholder="Giá"
              required />
          </div>
          <div class="col-md-5">
            <select v-model="variant.productSizeId" class="form-select" required>
              <option disabled value="">Chọn size</option>
              <option v-for="size in productSizes" :key="size.productSizeId" :value="size.productSizeId">
                {{ size.productSizeName }}
              </option>
            </select>
          </div>
          <div class="col-md-2 text-end">
            <button type="button" class="btn btn-outline-danger btn-sm" @click="removeVariant(index)"
              v-if="product.productVariants.length > 1">
              Xoá
            </button>
          </div>
        </div>

        <button type="button" class="btn btn-outline-secondary mt-2" @click="addVariant">
          + Thêm biến thể
        </button>
      </div>

      <div class="text-end">
        <button type="submit" class="btn btn-primary px-4">
          Tạo sản phẩm
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { $toast, $repositories }: any = useNuxtApp()

const previewUrl = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const productSizes = ref<{ productSizeId: number; productSizeName: string }[]>([])

const product = ref({
  productName: '',
  productDescription: '',
  productImage: '',
  createdBy: process.client ? Number(localStorage.getItem('accountId')) : 0,
  productVariants: [
    {
      productVariantPrice: 0,
      productSizeId: null
    }
  ]
})

onMounted(async () => {
  try {
    productSizes.value = await $repositories.configDataRepository.fetchProductSizes()
  } catch (error) {
    $toast.error('Không thể tải danh sách kích thước sản phẩm!')
  }
})

const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    previewUrl.value = URL.createObjectURL(selectedFile.value)
  }
}

const addVariant = () => {
  product.value.productVariants.push({
    productVariantPrice: 0,
    productSizeId: null
  })
}

const removeVariant = (index: number) => {
  product.value.productVariants.splice(index, 1)
}

const handleSubmit = async () => {
  let imageUrl = ''

  try {
    if (selectedFile.value) {
      const formData = new FormData()
      formData.append('image', selectedFile.value)

      const uploadResponse = await $fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      imageUrl = uploadResponse.imageUrl
      product.value.productImage = imageUrl
    }

    await $repositories.productRepository.createProduct(product.value)
    $toast.success('Tạo sản phẩm thành công!')
    navigateTo('/sale/products')
  } catch (err) {
    const message = err?.response?.data?.message || 'Đã xảy ra lỗi không xác định'
    $toast.error(message)
    if (imageUrl) {
      try {
        await $fetch('/api/image', {
          method: 'DELETE',
          body: { imageUrl }
        })
        console.log('Đã rollback ảnh.')
      } catch (deleteErr) {
        console.warn('Không thể xóa ảnh:', deleteErr)
      }
    }
  }
}
</script>
