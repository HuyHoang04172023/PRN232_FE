<template>
  <div class="container py-4">
    <div class="row mb-4">
      <div class="col-12 col-md-6 mb-4">
        <OrdersByStatusPie />
      </div>

      <div class="col-12 col-md-6 mb-4">
        <OrderSummary />
      </div>

      <div class="col-12 col-md-6 mb-4">
        <OrderByMonth />
      </div>

      <div class="col-12 col-md-6 mb-4">
        <OrderStatusMonthly />
      </div>
    </div>
  </div>
</template>

<script setup>
import OrdersByStatusPie from '@/components/statical-sale/OrdersByStatusPie.vue'
import OrderSummary from '@/components/statical-sale/OrderSummary.vue'
import OrderByMonth from '@/components/statical-sale/OrderByMonth.vue'
import OrderStatusMonthly from '@/components/statical-sale/OrderStatusMonthly.vue'
</script>
