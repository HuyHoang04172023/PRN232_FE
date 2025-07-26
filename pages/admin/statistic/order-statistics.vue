<template>
  <div class="container py-4">
    <div class="row mb-4">
      <div class="col-12 col-md-6 mb-4">
        <OrdersPerMonthChart />
      </div>

      <div class="col-12 col-md-6 mb-4">
        <RevenuePerMonthChart />
      </div>

      <div class="col-12 col-md-6 mb-4">
        <OrdersByStatusChart />
      </div>

      <div class="col-12 col-md-6 mb-4">
        <RevenueByShopChart />
      </div>

      <div class="col-12 col-md-6 mb-4">
        <OrdersByShopChart />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

import OrdersPerMonthChart from '~/components/statical-admin/order/OrdersPerMonthChart.vue'
import RevenuePerMonthChart from '~/components/statical-admin/order/RevenuePerMonthChart.vue'
import OrdersByStatusChart from '~/components/statical-admin/order/OrdersByStatusChart.vue'
import RevenueByShopChart from '~/components/statical-admin/order/RevenueByShopChart.vue'
import OrdersByShopChart from '~/components/statical-admin/order/OrdersByShopChart.vue'
</script>
