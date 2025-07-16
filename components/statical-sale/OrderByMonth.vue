<template>
  <div class="p-4 border rounded shadow">
    <h2 class="text-lg font-bold mb-2">Số đơn hàng theo tháng</h2>
    <Bar v-if="chartData" :data="chartData" />
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

onMounted(async () => {
  try {
    if (process.client) {
      shopId.value = localStorage.getItem('shopId')
    }

    const response = await $repositories.statisticalSaleRepository.ordersByMonth(shopId.value)

    const sorted = (response || []).sort((a, b) => (a.year - b.year) || (a.month - b.month))

    chartData.value = {
      labels: sorted.map(item => `Tháng ${item.month}`),
      datasets: [
        {
          label: 'Số đơn hàng',
          data: sorted.map(item => item.totalOrders),
          backgroundColor: 'rgba(75, 192, 192, 0.5)'
        }
      ]
    }
  } catch (error) {
    $toast.error('Không thể tải dữ liệu đơn hàng theo tháng!')
  }
})
</script>
