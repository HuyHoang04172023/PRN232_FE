<template>
  <div class="p-4 border rounded shadow bg-white">
    <h2 class="text-lg font-bold mb-4">Số lượng sản phẩm theo cửa hàng</h2>
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
  const response = await $repositories.statisticalAdminRepository.productsByShop2()

  const data = response || []

  const labels = data.map((item: any) => item.shopName)
  const productCounts = data.map((item: any) => item.productCount)

  if (canvasRef.value) {
    new Chart(canvasRef.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Sản phẩm',
            data: productCounts,
            backgroundColor: '#4ade80', // xanh lá
          },
        ],
      },
      options: {
        responsive: true,
        indexAxis: 'y', // biểu đồ ngang giúp dễ đọc tên shop dài
        scales: {
          x: {
            beginAtZero: true,
            ticks: { precision: 0 },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return `Sản phẩm: ${ctx.parsed.x}`
              },
            },
          },
        },
      },
    })
  }
})
</script>
