<template>
  <div class="container py-4">
    <div class="row mb-4">
      <div class="col-12 col-md-6 mb-4">
        <RevenueBarChart />
      </div>
      <div class="col-12 col-md-12 mb-4">
        <DailyRevenueLine />
      </div>
    </div>
  </div>
</template>

<script setup>
import RevenueBarChart from '@/components/statical-sale/RevenueBarChart.vue'
import DailyRevenueLine from '@/components/statical-sale/DailyRevenueLine.vue'
</script>
