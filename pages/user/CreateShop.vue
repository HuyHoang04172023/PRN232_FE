<template>
  <div class="container mt-5">
    <h2 class="mb-4">Tạo cửa hàng mới</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label class="form-label">Tên cửa hàng</label>
        <input v-model="shop.shopName" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Địa chỉ</label>
        <input v-model="shop.shopAddress" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Mô tả</label>
        <textarea v-model="shop.shopDescription" class="form-control" rows="3" />
      </div>

      <div class="mb-3">
        <label class="form-label">Ảnh cửa hàng</label>
        <input type="file" class="form-control" @change="handleImageUpload" accept="image/*" />
        <div v-if="previewUrl" class="mt-3">
          <strong>Xem trước ảnh:</strong><br />
          <img :src="previewUrl" alt="Preview" class="img-thumbnail" style="max-height: 200px;" />
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Tạo cửa hàng</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const { $toast, $repositories }: any = useNuxtApp()

const shop = ref({
  shopName: '',
  shopAddress: '',
  shopImage: '',
  shopDescription: '',
  userId: localStorage.getItem('accountId')
})

const previewUrl = ref<string | null>(null)
const selectedFile = ref<File | null>(null)

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

    await $repositories.shopRepository.createShop(shop.value)

    $toast.success('Tạo cửa hàng thành công!')
    navigateTo('/shop')
  } catch (err) {
    $toast.error('Tạo cửa hàng thất bại!')

    if (imageUrl) {
      try {
        await $fetch('/api/image', {
          method: 'DELETE',
          body: { imageUrl }
        })
        console.log('Ảnh đã được xóa do tạo shop thất bại.')
      } catch (deleteErr) {
        console.warn('Không thể xóa ảnh:', deleteErr)
      }
    }
  }
}
</script>
