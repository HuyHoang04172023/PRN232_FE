<template>
    <div class="p-4 border rounded shadow bg-white">
        <h2 class="text-lg font-bold mb-4">Số lượng đơn hàng theo tháng</h2>
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
    const response = await $repositories.statisticalAdminRepository.ordersPerMonth()

    const data = response || []

    const labels = data.map((item: any) => formatMonth(item.month))
    const orderCounts = data.map((item: any) => item.totalOrders)

    if (canvasRef.value) {
        new Chart(canvasRef.value, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Đơn hàng',
                        data: orderCounts,
                        fill: true,
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
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
                        ticks: { precision: 0 },
                    },
                },
                plugins: {
                    legend: { display: true },
                    tooltip: {
                        callbacks: {
                            label: function (ctx) {
                                return `Đơn hàng: ${ctx.parsed.y}`
                            },
                        },
                    },
                },
            },
        })
    }
})
</script>
