<template>
  <div class="p-4 border rounded shadow bg-white">
    <h2 class="text-lg font-bold mb-4">Trạng thái đơn hàng</h2>
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
  const response = await $repositories.statisticalAdminRepository.ordersByStatus()

  const data = response || []

  const labels = data.map((item: any) => item.status)
  const counts = data.map((item: any) => item.count)

  if (canvasRef.value) {
    new Chart(canvasRef.value, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Số lượng',
            data: counts,
            backgroundColor: [
              '#f87171', // cancel - đỏ
              '#facc15', // doing - vàng
              '#60a5fa', // pending - xanh dương nhạt
              '#38bdf8', // shipping - xanh dương
              '#4ade80', // success - xanh lá
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return `${ctx.label}: ${ctx.parsed} đơn`
              },
            },
          },
        },
      },
    })
  }
})
</script>
