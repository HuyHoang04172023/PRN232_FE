<template>
    <div class="p-4 border rounded shadow bg-white">
        <h2 class="text-lg font-bold mb-4">Doanh thu theo tháng</h2>
        <canvas ref="canvasRef" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { $repositories }: any = useNuxtApp()

function formatMonth(monthStr: string): string {
    const [year, month] = monthStr.split('-')
    return `${month}/${year}`
}

onMounted(async () => {
    const response = await $repositories.statisticalAdminRepository.revenuePerMonth()

    const data = response || []

    const labels = data.map((item: any) => formatMonth(item.month))
    const revenues = data.map((item: any) => item.revenue)

    if (canvasRef.value) {
        new Chart(canvasRef.value, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Doanh thu (VNĐ)',
                        data: revenues,
                        fill: true,
                        borderColor: '#14b8a6', // teal
                        backgroundColor: 'rgba(20, 184, 166, 0.2)',
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value) {
                                return value.toLocaleString('vi-VN') + ' ₫'
                            },
                        },
                    },
                },
                plugins: {
                    legend: { display: true },
                    tooltip: {
                        callbacks: {
                            label: function (ctx) {
                                return 'Doanh thu: ' + ctx.parsed.y.toLocaleString('vi-VN') + ' ₫'
                            },
                        },
                    },
                },
            },
        })
    }
})
</script>
