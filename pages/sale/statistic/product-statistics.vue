<template>
  <div class="container py-4">
    <div class="row mb-4">
      <div class="col-12 col-md-6 mb-4">
        <ProductLikesDoughnut />
      </div>
      <div class="col-12 col-md-6 mb-4">
        <TopProductsPolar />
      </div>
    </div>
  </div>
</template>

<script setup>
import TopProductsPolar from '@/components/statical-sale/TopProductsPolar.vue'
import ProductLikesDoughnut from '@/components/statical-sale/ProductLikesDoughnut.vue'
</script>
