<template>
  <div>
    <div class="p-4 border rounded shadow">
      <h2 class="font-bold mb-2">🥧 Tình trạng đơn hàng</h2>
      <canvas ref="canvas" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const { $toast, $repositories }: any = useNuxtApp()

const shopId = ref<string | null>(null)
const canvas = ref()
let chartInstance = null

onMounted(async () => {
  try {
    if (process.client) {
      shopId.value = localStorage.getItem('shopId')
    }

    const response = await $repositories.statisticalSaleRepository.ordersByStatus(shopId.value)

    const labels = response.map(item => convertStatusLabel(item.status))
    const data = response.map(item => item.count)

    if (chartInstance) chartInstance.destroy()

    chartInstance = new Chart(canvas.value, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7']
        }]
      },
      options: {
        responsive: true
      }
    })
  } catch (error) {
    $toast.error('Không thể tải dữ liệu tình trạng đơn hàng!')
  }
})

// Tuỳ chỉnh tên trạng thái hiển thị tiếng Việt
function convertStatusLabel(status) {
  switch (status) {
    case 'pending': return 'Đang xử lý'
    case 'success': return 'Hoàn thành'
    case 'canceled': return 'Đã hủy'
    case 'shipping': return 'Đang giao'
    default: return status
  }
}
</script>
