<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Danh sách cửa hàng</h2>

    <div v-for="(row, rowIndex) in groupedShops" :key="rowIndex" class="row mb-4">
      <div v-for="shop in row" :key="shop.shopId" class="col-12 col-md-4 mb-3">
        <div class="shop-card d-flex border rounded shadow-sm h-100 overflow-hidden"
          @click="() => goToShopDetail(shop.shopId)" style="cursor: pointer;">
          <img :src="shop.shopImage" alt="Shop Image" class="shop-image" />

          <div class="p-3 flex-grow-1 d-flex flex-column justify-content-between">
            <div>
              <h5 class="mb-2">{{ shop.shopName }}</h5>
              <p class="mb-1"><strong>Địa chỉ:</strong> {{ shop.shopAddress }}</p>
              <p class="mb-1"><strong>Mô tả:</strong> {{ shop.shopDescription }}</p>
            </div>
            <div>
              <span class="badge" :class="'bg-' + statusVariant(shop.statusShop)">
                {{ shop.statusShop }}
              </span>
              <div class="text-muted mt-1" style="font-size: 0.85rem;">
                Ngày tạo: {{ formatDate(shop.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $toast, $repositories }: any = useNuxtApp();
const router = useRouter();

const shops = ref<any[]>([]);
const groupedShops = ref<any[][]>([]);

const goToShopDetail = (shopId: string) => {
  router.push(`/shop/${shopId}`);
};

// Chia danh sách thành từng nhóm 3 phần tử
function chunkArray(arr: any[], chunkSize: number) {
  const chunked = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunked.push(arr.slice(i, i + chunkSize));
  }
  return chunked;
}

const statusVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'deactive':
      return 'secondary';
    case 'pending':
      return 'warning';
    default:
      return 'light';
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN');
};

onMounted(async () => {
  shops.value = await $repositories.shopRepository.getShopsByStatusName("active");
  $toast.success('Lấy danh sách cửa hàng thành công!');
  groupedShops.value = chunkArray(shops.value, 3);
});
</script>

<style scoped>
.shop-card {
  height: 200px;
  background-color: #fff;
}

.shop-image {
  width: 160px;
  height: 100%;
  object-fit: cover;
  border-right: 1px solid #ddd;
}
</style>
