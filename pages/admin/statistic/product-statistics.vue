<template>
  <div class="container py-4">
    <div class="row mb-4">
      <div class="col-12 col-md-6 mb-4">
        <ProductsByStatusChart />
      </div>

      <div class="col-12 col-md-6 mb-4">
        <TopSellingProductsChart />
      </div>

      <div class="col-12 col-md-6 mb-4">
        <ProductsByShopChart />
      </div>

      <div class="col-12 col-md-6 mb-4">
        <NewProductsPerMonthChart />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

import ProductsByStatusChart from '~/components/statical-admin/product/ProductsByStatusChart.vue'
import TopSellingProductsChart from '~/components/statical-admin/product/TopSellingProductsChart.vue'
import ProductsByShopChart from '~/components/statical-admin/product/ProductsByShopChart.vue'
import NewProductsPerMonthChart from '~/components/statical-admin/product/NewProductsPerMonthChart.vue'
</script>
