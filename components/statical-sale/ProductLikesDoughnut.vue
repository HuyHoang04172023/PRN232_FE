<template>
  <div>
    <h2 class="font-bold mb-2">❤️ Tỉ lệ lượt thích sản phẩm</h2>
    <canvas ref="canvas" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const { $toast, $repositories }: any = useNuxtApp()

const canvas = ref()
const shopId = ref<string | null>(null)
let chartInstance: Chart | null = null

onMounted(async () => {
  try {
    if (process.client) {
      shopId.value = localStorage.getItem('shopId')
    }

    const response = await $repositories.statisticalSaleRepository.productLikesRatio(shopId.value)

    const labels = response.map(item => item.productName)
    const data = response.map(item => item.likes)

    if (chartInstance) chartInstance.destroy()

    chartInstance = new Chart(canvas.value, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#f87171', '#facc15', '#4ade80', '#60a5fa', '#a78bfa', '#f472b6']
        }]
      },
      options: {
        responsive: true
      }
    })
  } catch (error) {
    $toast.error('Không thể tải dữ liệu lượt thích sản phẩm!')
  }
})
</script>
