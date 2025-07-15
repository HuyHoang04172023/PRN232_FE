<template>
  <div>
    <h2 class="font-bold mb-2">🌟 Top sản phẩm bán chạy</h2>
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
    type: 'polarArea',
    data: {
      labels: ['Trà sữa', 'Cafe', 'Nước ép', 'Sinh tố', 'Soda'],
      datasets: [{
        data: [90, 65, 45, 80, 50],
        backgroundColor: ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b']
      }]
    },
    options: {
      responsive: true
    }
  })
})
</script>
