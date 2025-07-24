<template>
    <div class="p-4 border rounded shadow bg-white">
        <h2 class="text-lg font-bold mb-4">Tình trạng sản phẩm</h2>
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
    const response = await $repositories.statisticalAdminRepository.productsByStatus()

    const data = response || []

    const labels = data.map((item: any) => item.status)
    const counts = data.map((item: any) => item.count)

    if (canvasRef.value) {
        new Chart(canvasRef.value, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Sản phẩm',
                        data: counts,
                        backgroundColor: ['#22c55e', '#ef4444'], // active: xanh, reject: đỏ
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (ctx) {
                                return `${ctx.label}: ${ctx.parsed} sản phẩm`
                            },
                        },
                    },
                },
            },
        })
    }
})
</script>
