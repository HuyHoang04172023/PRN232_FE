<template>
  <div class="container py-5" style="max-width: 700px">
    <h2 class="fw-bold mb-4 text-center">
      {{ isEdit ? 'Cập nhật cửa hàng' : 'Tạo cửa hàng mới' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="bg-light p-4 rounded shadow-sm border">
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Tên cửa hàng</label>
          <input v-model="shop.shopName" type="text" class="form-control" required />
        </div>
        <div class="col-md-6">
          <label class="form-label">Địa chỉ</label>
          <input v-model="shop.shopAddress" type="text" class="form-control" required />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Mô tả</label>
        <textarea v-model="shop.shopDescription" class="form-control" rows="3"
          placeholder="Nhập mô tả về cửa hàng..." />
      </div>

      <div class="mb-3">
        <label class="form-label">Ảnh cửa hàng</label>
        <input type="file" class="form-control" @change="handleImageUpload" accept="image/*" />
        <div v-if="previewUrl || shop.shopImage" class="mt-3 border rounded p-2 text-center bg-white">
          <label class="form-label mb-2 fw-semibold">Xem trước ảnh:</label><br />
          <img :src="previewUrl || shop.shopImage" alt="Preview" class="img-fluid"
            style="max-height: 200px; object-fit: contain;" />
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2 mt-4">
        <button v-if="isEdit" type="submit" class="btn btn-warning px-4">Cập nhật</button>
        <button v-if="isEdit" type="button" @click="handleDelete" class="btn btn-outline-danger">
          Xoá
        </button>
        <button v-else type="submit" class="btn btn-primary px-4">Tạo cửa hàng</button>
      </div>
    </form>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { $toast, $repositories }: any = useNuxtApp()
const userId = ref<string | null>(null)

const isEdit = ref(false)
const previewUrl = ref<string | null>(null)
const selectedFile = ref<File | null>(null)

const shop = ref({
  shopId: null,
  shopName: '',
  shopAddress: '',
  shopImage: '',
  shopDescription: '',
  createdBy: userId
})

onMounted(async () => {
  if (process.client) {
    userId.value = localStorage.getItem('accountId')
  }
  try {
    const result = await $repositories.shopRepository.getShopByUserId(userId.value)
    if (result) {
      shop.value = {
        shopId: result.shopId,
        shopName: result.shopName,
        shopAddress: result.shopAddress,
        shopImage: result.shopImage,
        shopDescription: result.shopDescription,
        createdBy: result.createdBy
      }
      isEdit.value = true
    }
  } catch (err) {
    isEdit.value = false
  }
})

const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
    previewUrl.value = URL.createObjectURL(selectedFile.value)
  }
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
      shop.value.shopImage = imageUrl
    }

    if (isEdit.value) {
      await $repositories.shopRepository.updateShopByShopId(shop.value.shopId, shop.value)
      $toast.success('Cập nhật cửa hàng thành công!')
    } else {
      await $repositories.shopRepository.createShop(shop.value)
      $toast.success('Tạo cửa hàng thành công!')
    }

    navigateTo('/')
  } catch (err) {
    $toast.error(`${isEdit.value ? 'Cập nhật' : 'Tạo'} cửa hàng thất bại!`)

    if (imageUrl) {
      try {
        await $fetch('/api/image', {
          method: 'DELETE',
          body: { imageUrl }
        })
        console.log('Ảnh đã được xóa do thất bại.')
      } catch (deleteErr) {
        console.warn('Không thể xóa ảnh:', deleteErr)
      }
    }
  }
}

const handleDelete = async () => {
  if (!confirm('Bạn có chắc muốn xoá cửa hàng này?')) return

  try {
    await $repositories.shopRepository.deleteShopByShopId(shop.value.shopId)
    $toast.success('Đã xoá cửa hàng.')
    shop.value = {
      shopId: null,
      shopName: '',
      shopAddress: '',
      shopImage: '',
      shopDescription: '',
      createdBy: userId
    }
    isEdit.value = false
    previewUrl.value = null
  } catch (err) {
    $toast.error('Xoá cửa hàng thất bại!')
  }
}
</script>
