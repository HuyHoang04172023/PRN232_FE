<template>
    <div class="p-4 border rounded shadow bg-white">
        <h2 class="text-lg font-bold mb-4">Số lượng người dùng mới theo tháng</h2>
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
    // "2025-03" => "03/2025"
    const [year, month] = monthStr.split('-')
    return `${month}/${year}`
}

onMounted(async () => {
    const response = await $repositories.statisticalAdminRepository.newUsersPerMonth()

    const data = response || []

    const labels = data.map((item: any) => formatMonth(item.month))
    const counts = data.map((item: any) => item.count)

    if (canvasRef.value) {
        new Chart(canvasRef.value, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Người dùng mới',
                        data: counts,
                        fill: true,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
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
                                return `Người dùng mới: ${ctx.parsed.y}`
                            },
                        },
                    },
                },
            },
        })
    }
})
</script>
