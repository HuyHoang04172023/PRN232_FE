<template>
  <div>
    <h2 class="font-bold mb-2">📊 Doanh thu theo tháng</h2>
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
    type: 'bar',
    data: {
      labels: ['01/2025', '02/2025', '03/2025', '04/2025'],
      datasets: [{
        label: 'Doanh thu (VNĐ)',
        data: [1200000, 1560000, 980000, 2150000],
        backgroundColor: '#3b82f6'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          ticks: {
            callback: val => val.toLocaleString('vi-VN') + ' ₫'
          }
        }
      }
    }
  })
})
</script>
