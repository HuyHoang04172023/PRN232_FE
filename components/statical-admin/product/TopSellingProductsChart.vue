<template>
    <div class="p-4 border rounded shadow bg-white">
        <h2 class="text-lg font-bold mb-4">Top sản phẩm bán chạy</h2>
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
    const response = await $repositories.statisticalAdminRepository.topSellingProducts()

    const data = response || []

    const labels = data.map((item: any) => `#${item.productId} - ${item.productName}`)
    const soldCounts = data.map((item: any) => item.totalSold)

    if (canvasRef.value) {
        new Chart(canvasRef.value, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Đã bán',
                        data: soldCounts,
                        backgroundColor: '#f97316', // cam
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
                                return `Đã bán: ${ctx.parsed.x} ly`
                            },
                        },
                    },
                },
            },
        })
    }
})
</script>
