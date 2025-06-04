<template>
  <div class="container mt-5 text-center row">
    <button class="btn btn-primary col-12" @click="showToast">
      Hiện Toast
    </button>
  </div>
</template>
<script setup lang="ts">
const { $toast } : any = useNuxtApp()

function showToast() {
  $toast.success('🎉 Thành công với Vue3-Toastify!')
  $toast.success("✅ Thành công rồi nha!")

}

</script>