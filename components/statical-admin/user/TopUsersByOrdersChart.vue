<template>
    <div class="p-4 border rounded shadow bg-white">
        <h2 class="text-lg font-bold mb-4">Người dùng có nhiều đơn hàng nhất</h2>
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
    const response = await $repositories.statisticalAdminRepository.topUsersByOrders()

    const data = response || []

    const labels = data.map((item: any) => `#${item.userId} - ${item.userName}`)
    const orderCounts = data.map((item: any) => item.totalOrders)

    if (canvasRef.value) {
        new Chart(canvasRef.value, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Tổng số đơn hàng',
                        data: orderCounts,
                        backgroundColor: '#a855f7', // tím
                    },
                ],
            },
            options: {
                responsive: true,
                indexAxis: 'y', // biểu đồ ngang
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
                                return `Đơn hàng: ${ctx.parsed.x}`
                            },
                        },
                    },
                },
            },
        })
    }
})
</script>
