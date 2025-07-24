<template>
    <div class="p-4 border rounded shadow bg-white">
        <h2 class="text-lg font-bold mb-4">Phân loại người dùng theo vai trò</h2>
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
    const response = await $repositories.statisticalAdminRepository.usersByRole()

    const data = response || []

    const labels = data.map((item: any) => item.role)
    const counts = data.map((item: any) => item.count)

    if (canvasRef.value) {
        new Chart(canvasRef.value, {
            type: 'pie',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Người dùng',
                        data: counts,
                        backgroundColor: ['#facc15', '#60a5fa', '#34d399'], // vàng, xanh dương, xanh lá
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
                                return `${ctx.label}: ${ctx.parsed} người dùng`
                            },
                        },
                    },
                },
            },
        })
    }
})
</script>
