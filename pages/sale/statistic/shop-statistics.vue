<template>
  <div class="container py-4">
    <div class="row mb-4">
      <div class="col-12 col-md-6 mb-4">
        <RevenueBarChart />
      </div>
      <div class="col-12 col-md-12 mb-4">
        <DailyRevenueLine />
      </div>
      <div class="col-12 col-md-6 mb-4">
        <ProductLikesDoughnut />
      </div>
      <div class="col-12 col-md-6 mb-4">
        <OrdersByStatusPie />
      </div>
      <div class="col-12 col-md-6 mb-4">
        <TopProductsPolar />
      </div>
    </div>
  </div>
</template>

<script setup>
import RevenueBarChart from '@/components/statical-sale/RevenueBarChart.vue'
import OrdersByStatusPie from '@/components/statical-sale/OrdersByStatusPie.vue'
import TopProductsPolar from '@/components/statical-sale/TopProductsPolar.vue'
import DailyRevenueLine from '@/components/statical-sale/DailyRevenueLine.vue'
import ProductLikesDoughnut from '@/components/statical-sale/ProductLikesDoughnut.vue'
</script>
