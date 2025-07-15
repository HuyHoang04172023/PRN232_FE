<template>
  <div class="p-6 grid gap-6">
    <RevenueBarChart />
    <OrdersByStatusPie />
    <TopProductsPolar />
    <DailyRevenueLine />
    <ProductLikesDoughnut />
  </div>
</template>

<script setup>
import RevenueBarChart from '@/components/statical-sale/RevenueBarChart.vue'
import OrdersByStatusPie from '@/components/statical-sale/OrdersByStatusPie.vue'
import TopProductsPolar from '@/components/statical-sale/TopProductsPolar.vue'
import DailyRevenueLine from '@/components/statical-sale/DailyRevenueLine.vue'
import ProductLikesDoughnut from '@/components/statical-sale/ProductLikesDoughnut.vue'
</script>
