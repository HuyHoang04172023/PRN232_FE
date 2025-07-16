<template>
  <div class="container py-5">
    <h2 class="mb-4 text-center">📊 Thống kê hệ thống</h2>

    <div class="row g-4">
      <div class="col-12 col-md-6 col-lg-4" v-for="card in statisticCards" :key="card.title">
        <div class="card h-100 shadow-sm border-0 hover-shadow" @click="navigateTo(card.route)" style="cursor: pointer;">
          <div class="card-body d-flex flex-column align-items-start">
            <div class="mb-2 fs-3">{{ card.icon }}</div>
            <h5 class="card-title">{{ card.title }}</h5>
            <p class="card-text text-muted">{{ card.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const statisticCards = [
  {
    title: 'Thống kê doanh thu',
    description: 'Xem biểu đồ doanh thu của từng cửa hàng.',
    icon: '🏪',
    route: '/sale/statistic/shop-statistics'
  },
  {
    title: 'Thống kê sản phẩm',
    description: 'Xem các sản phẩm bán chạy hoặc được yêu thích nhất.',
    icon: '⭐',
    route: '/sale/statistic/product-statistics'
  },
  {
    title: 'Trạng thái đơn hàng',
    description: 'Phân tích số lượng đơn hàng theo trạng thái.',
    icon: '📦',
    route: '/sale/statistic/order-statistics'
  }
]

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.hover-shadow:hover {
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.2s ease-in-out;
}
</style>
