<template>
  <div>
    <h2 class="font-bold mb-2">📊 Doanh thu theo tháng</h2>
    <canvas ref="canvas" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const { $toast, $repositories }: any = useNuxtApp()

const shopId = ref<string | null>(null);
const canvas = ref()

onMounted(async () => {
  try {
    if (process.client) {
        shopId.value = localStorage.getItem('shopId');
    }
    const response = await $repositories.statisticalSaleRepository.revenueByMonth(shopId.value)

    const labels = response.map(item => item.month)
    const revenueData = response.map(item => item.revenue)

    new Chart(canvas.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Doanh thu (VNĐ)',
          data: revenueData,
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
  } catch (error) {
    $toast.error('Không thể tải dữ liệu doanh thu theo tháng!')
  }
})
</script>
