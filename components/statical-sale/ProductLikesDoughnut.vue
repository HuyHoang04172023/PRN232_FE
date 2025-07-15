<template>
  <div>
    <h2 class="font-bold mb-2">❤️ Tỉ lệ lượt thích sản phẩm</h2>
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
    type: 'doughnut',
    data: {
      labels: ['Trà đào', 'Cafe sữa', 'Sữa tươi trân châu', 'Sinh tố xoài'],
      datasets: [{
        data: [40, 30, 15, 15],
        backgroundColor: ['#f87171', '#facc15', '#4ade80', '#60a5fa']
      }]
    },
    options: {
      responsive: true
    }
  })
})
</script>
