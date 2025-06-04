<template>
  <div>
    <h3>Dự báo thời tiết</h3>
    <ul>
      <li v-for="item in weathers" :key="item.date">
        {{ item.date }} - {{ item.summary }} - {{ item.temperatureC }}°C
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Weather } from "~/types/weather"
const { $toast, $repositories }: any = useNuxtApp();

const weathers = ref<Weather[]>([])

onMounted(async () => {
  weathers.value = await $repositories.weatherRepository.fetchWeathers();
  $toast.success('Thành công!');
})
console.log('Hihi', weathers.value);

</script>

