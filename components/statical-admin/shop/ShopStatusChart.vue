<template>
  <div class="p-4 border rounded shadow bg-white">
    <h2 class="text-lg font-bold mb-4">Tình trạng cửa hàng</h2>
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { $repositories }: any = useNuxtApp()

onMounted(async () => {
  const response = await $repositories.statisticalAdminRepository.shopByStatus()

  const data = response || []

  const labels = data.map((item: any) => item.status)
  const counts = data.map((item: any) => item.count)

  if (canvasRef.value) {
    new Chart(canvasRef.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Số lượng cửa hàng',
            data: counts,
            backgroundColor: [
              '#4ade80', // green
              '#f97316', // orange
              '#facc15', // yellow
              '#ef4444', // red
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: false,
            text: 'Shop Status',
          },
        },
      },
    })
  }
})
</script>
