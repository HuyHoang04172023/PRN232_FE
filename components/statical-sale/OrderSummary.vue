<template>
  <div class="p-4 border rounded shadow">
    <h2 class="text-lg font-bold mb-4">Biểu đồ tổng quan đơn hàng</h2>
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const { $toast, $repositories }: any = useNuxtApp()

const shopId = ref<string | null>(null)
const chartData = ref<any>(null)

const chartOptions = {
  indexAxis: 'y',
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: { precision: 0 }
    }
  }
}

onMounted(async () => {
  try {
    if (process.client) {
      shopId.value = localStorage.getItem('shopId')
    }

    const response = await $repositories.statisticalSaleRepository.ordersSummary(shopId.value)

    const raw = response || {
      totalOrders: 0,
      successOrders: 0,
      cancelledOrders: 0,
      totalRevenue: 0
    }

    const otherOrders = raw.totalOrders - raw.successOrders - raw.cancelledOrders

    chartData.value = {
      labels: ['Đơn thành công', 'Đơn huỷ', 'Đơn khác'],
      datasets: [
        {
          label: 'Số lượng đơn',
          data: [raw.successOrders, raw.cancelledOrders, otherOrders],
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(201, 203, 207, 0.7)'
          ],
          borderRadius: 6,
          barThickness: 24
        }
      ]
    }
  } catch (error) {
    $toast.error('Không thể tải dữ liệu tổng quan đơn hàng!')
  }
})
</script>
