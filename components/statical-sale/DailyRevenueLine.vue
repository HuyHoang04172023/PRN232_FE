<template>
  <div>
    <h2 class="font-bold mb-2">📈 Doanh thu theo ngày (04/2025)</h2>
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
    type: 'line',
    data: {
      labels: ['01', '02', '03', '04', '05', '06', '07'],
      datasets: [{
        label: 'Doanh thu (VNĐ)',
        data: [150000, 300000, 280000, 500000, 220000, 400000, 330000],
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.3
      }]
    },
    options: {
      responsive: true
    }
  })
})
</script>
