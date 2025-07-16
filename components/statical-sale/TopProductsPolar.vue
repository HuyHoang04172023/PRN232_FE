<template>
  <div>
    <h2 class="font-bold mb-2">🌟 Top sản phẩm bán chạy</h2>
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

    const response = await $repositories.statisticalSaleRepository.topProducts(shopId.value)

    const labels = response.map(item => item.productName)
    const data = response.map(item => item.quantity)

    if (chartInstance) chartInstance.destroy()

    chartInstance = new Chart(canvas.value, {
      type: 'polarArea',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
        }]
      },
      options: {
        responsive: true
      }
    })
  } catch (error) {
    $toast.error('Không thể tải dữ liệu top sản phẩm!')
  }
})
</script>
