<template>
  <div class="container py-4">
    <div class="row mb-4">
      <div class="col-12 col-md-6 mb-4">
        <ShopStatusChart />
      </div>
      <div class="col-12 col-md-6 mb-4">
        <ShopRevenueChart />
      </div>
      <div class="col-12 col-md-6 mb-4">
        <ShopOrderCountChart />
      </div>
      <div class="col-12 col-md-6 mb-4">
        <ShopProductCountChart />
      </div>
      <div class="col-12 col-md-6 mb-4">
        <ShopNewPerMonthChart />
      </div>
      <!-- <div class="col-12 col-md-6 mb-4">
        <ShopRevenueChart />
      </div> -->
    </div>
  </div>
</template>

<script setup>
import ShopStatusChart from '~/components/statical-admin/shop/ShopStatusChart.vue'
import ShopRevenueChart from '~/components/statical-admin/shop/ShopRevenueChart.vue'
import ShopOrderCountChart from '~/components/statical-admin/shop/ShopOrderCountChart.vue'
import ShopProductCountChart from '~/components/statical-admin/shop/ShopProductCountChart.vue'
import ShopNewPerMonthChart from '~/components/statical-admin/shop/ShopNewPerMonthChart.vue'
</script>
