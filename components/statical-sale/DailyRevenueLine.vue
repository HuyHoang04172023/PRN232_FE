<template>
  <div>
    <h2 class="font-bold mb-4">
      📈 Doanh thu theo ngày ({{ selectedMonth }}/{{ selectedYear }})
    </h2>

    <div class="d-flex align-items-center gap-3 mb-4">
      <select v-model="selectedMonth" class="form-select w-auto">
        <option v-for="m in 12" :key="m" :value="m">Tháng {{ m }}</option>
      </select>

      <select v-model="selectedYear" class="form-select w-auto">
        <option v-for="y in [2023, 2024, 2025]" :key="y" :value="y">Năm {{ y }}</option>
      </select>
    </div>

    <canvas ref="canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const { $toast, $repositories }: any = useNuxtApp()

const canvas = ref()
let chartInstance: Chart | null = null

const shopId = ref<string | null>(null)
const selectedMonth = ref(new Date().getMonth() + 1)
const selectedYear = ref(new Date().getFullYear())

const loadChart = async () => {
  try {
    if (process.client && !shopId.value) {
      shopId.value = localStorage.getItem('shopId')
    }

    const response = await $repositories.statisticalSaleRepository.dailyRevenue(
      shopId.value,
      selectedYear.value,
      selectedMonth.value
    )

    const labels = response.map(item => `Ngày ${item.day}`)
    const data = response.map(item => item.revenue)

    if (chartInstance) chartInstance.destroy()

    chartInstance = new Chart(canvas.value, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Doanh thu (VNĐ)',
          data,
          fill: false,
          borderColor: '#3b82f6',
          tension: 0.3
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
    $toast.error('Không thể tải dữ liệu doanh thu!')
  }
}

onMounted(() => {
  loadChart()
})

watch([selectedMonth, selectedYear], () => {
  loadChart()
})
</script>
