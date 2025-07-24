<template>
  <div class="container py-4">
    <div class="row mb-4">
      <div class="col-12 col-md-6 mb-4">
        <UserNewPerMonthChart />
      </div>
      <div class="col-12 col-md-6 mb-4">
        <TopUsersByOrdersChart />
      </div>
      <div class="col-12 col-md-6 mb-4">
        <ShopsByUserChart />
      </div>
      <div class="col-12 col-md-6 mb-4">
        <UsersByRoleChart />
      </div>
    </div>
  </div>
</template>

<script setup>
import UserNewPerMonthChart from '~/components/statical-admin/user/UserNewPerMonthChart.vue'
import TopUsersByOrdersChart from '~/components/statical-admin/user/TopUsersByOrdersChart.vue'
import ShopsByUserChart from '~/components/statical-admin/user/ShopsByUserChart.vue'
import UsersByRoleChart from '~/components/statical-admin/user/UsersByRoleChart.vue'
</script>
