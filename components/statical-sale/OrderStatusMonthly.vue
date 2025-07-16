<template>
  <div class="p-4 border rounded shadow">
    <h2 class="text-lg font-bold mb-2">Trạng thái đơn hàng theo tháng</h2>
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

    const response = await $repositories.statisticalSaleRepository.ordersStatusMonthly(shopId.value)

    const raw = response || []

    const months = [...new Set(raw.map(i => `Tháng ${i.month}`))]
    const statuses = [...new Set(raw.map(i => i.status))]

    chartData.value = {
      labels: months,
      datasets: statuses.map(status => ({
        label: status,
        data: months.map(month =>
          raw.find(i => `Tháng ${i.month}` === month && i.status === status)?.count || 0
        ),
        backgroundColor: undefined // Chart.js sẽ tự gán màu
      }))
    }

  } catch (error) {
    $toast.error('Không thể tải dữ liệu đơn hàng theo tháng!')
  }
})
</script>
