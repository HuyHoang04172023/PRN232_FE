<template>
  <div>
    <h2 class="font-bold mb-2">🥧 Tình trạng đơn hàng</h2>
    <canvas ref="canvas" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const canvas = ref()

onMounted(() => {
  new Chart(canvas.value, {
    type: 'pie',
    data: {
      labels: ['Hoàn thành', 'Đang xử lý', 'Đã hủy'],
      datasets: [{
        data: [25, 10, 5],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
      }]
    },
    options: {
      responsive: true
    }
  })
})
</script>
