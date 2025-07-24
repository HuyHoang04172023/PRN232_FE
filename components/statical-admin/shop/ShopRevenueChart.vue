<template>
  <div class="p-4 border rounded shadow bg-white">
    <h2 class="text-lg font-bold mb-4">Doanh thu cửa hàng</h2>
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
  const response = await $repositories.statisticalAdminRepository.revenueByShop()

  const data = response || []

  const labels = data.map((item: any) => item.shopName)
  const revenues = data.map((item: any) => item.revenue)

  if (canvasRef.value) {
    new Chart(canvasRef.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Doanh thu (VNĐ)',
            data: revenues,
            backgroundColor: '#3b82f6', // Màu xanh dương
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            ticks: {
              callback: function (value) {
                return value.toLocaleString('vi-VN') + ' ₫'
              },
            },
            beginAtZero: true,
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return ctx.dataset.label + ': ' + ctx.parsed.y.toLocaleString('vi-VN') + ' ₫'
              },
            },
          },
        },
      },
    })
  }
})
</script>
