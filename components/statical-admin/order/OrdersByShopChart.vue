<template>
    <div class="p-4 border rounded shadow bg-white">
        <h2 class="text-lg font-bold mb-4">Số lượng đơn hàng theo cửa hàng</h2>
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
    const response = await $repositories.statisticalAdminRepository.ordersByShop2()

    const data = response || []

    const labels = data.map((item: any) => item.shopName)
    const orderCounts = data.map((item: any) => item.totalOrders)

    if (canvasRef.value) {
        new Chart(canvasRef.value, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Số đơn hàng',
                        data: orderCounts,
                        backgroundColor: '#60a5fa', // xanh dương nhạt
                    },
                ],
            },
            options: {
                responsive: true,
                indexAxis: 'y', // biểu đồ ngang
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                        },
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
