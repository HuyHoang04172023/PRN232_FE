<template>
  <div class="container py-5">
    <h2 class="text-center mb-5 fw-bold text-primary">Thống kê hệ thống</h2>

    <div class="row g-4">
      <div class="col-12 col-md-6 col-lg-4" v-for="card in statisticCards" :key="card.title">
        <div class="card h-100 border-0 shadow-sm statistic-card" @click="navigateTo(card.route)"
          style="cursor: pointer">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <div class="stat-icon rounded mb-3 d-flex align-items-center justify-content-center">
                {{ card.icon }}
              </div>
              <h5 class="card-title fw-semibold">{{ card.title }}</h5>
              <p class="card-text text-muted mb-0">{{ card.description }}</p>
            </div>
            <div class="text-end text-primary mt-4 fw-semibold small">
              Xem chi tiết →
            </div>
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
    icon: '📈',
    route: '/sale/statistic/shop-statistics'
  },
  {
    title: 'Thống kê sản phẩm',
    description: 'Xem các sản phẩm bán chạy hoặc được yêu thích nhất.',
    icon: '📊',
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
.stat-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  background-color: #f0f4ff;
  color: #0d6efd;
}

.statistic-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-in-out;
}
</style>
