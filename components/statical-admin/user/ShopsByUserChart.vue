<template>
    <div class="p-4 border rounded shadow bg-white">
        <h2 class="text-lg font-bold mb-4">Số lượng cửa hàng theo người dùng</h2>
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
    const response = await $repositories.statisticalAdminRepository.shopsByUser()

    const data = response || []

    const labels = data.map((item: any) => `#${item.userId} - ${item.userName}`)
    const shopCounts = data.map((item: any) => item.shopCount)

    if (canvasRef.value) {
        new Chart(canvasRef.value, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Số cửa hàng',
                        data: shopCounts,
                        backgroundColor: '#3b82f6', // xanh dương
                    },
                ],
            },
            options: {
                responsive: true,
                indexAxis: 'y', // biểu đồ ngang giúp dễ đọc với nhiều tên người dùng
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
                                return `Cửa hàng: ${ctx.parsed.x}`
                            },
                        },
                    },
                },
            },
        })
    }
})
</script>
