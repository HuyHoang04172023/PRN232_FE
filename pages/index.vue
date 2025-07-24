<template>
  <div class="container mt-5">
    <div class="search-bar-container mb-4 d-flex justify-content-center">
      <div class="input-group search-wrapper shadow-sm">
        <span class="input-group-text bg-white border-0">
          <i class="bi bi-search"></i>
        </span>
        <input v-model="searchKeyword" type="text" class="form-control border-0" placeholder="Tìm món hoặc quán ăn" />
      </div>
    </div>

    <div class="promo-wrapper d-flex justify-content-center mb-5">
      <div class="promo-categories d-flex gap-3 overflow-auto">
        <div v-for="(promo, index) in promos" :key="index" class="promo-item text-white text-center flex-shrink-0"
          :style="{ backgroundImage: `url(${promo.image})` }">
          <div class="overlay d-flex align-items-center justify-content-center">
            <span class="fw-semibold">{{ promo.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <h2 class="text-center mb-4">Danh sách cửa hàng</h2>
    <div class="row">
      <div v-for="shop in filteredShops" :key="shop.shopId" class="col-12 col-md-4 mb-4">
        <div class="card h-100 shadow-sm border-0 overflow-hidden shop-card" @click="() => goToShopDetail(shop.shopId)"
          style="cursor: pointer;">
          <img :src="shop.shopImage" alt="Shop Image" class="card-img-top shop-image" />
          <div class="card-body text-center d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title fw-bold">{{ shop.shopName }}</h5>
              <p class="card-text text-muted mb-1">
                <i class="bi bi-geo-alt-fill me-1"></i>{{ shop.shopAddress }}
              </p>
              <p class="card-text small">{{ shop.shopDescription }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredShops.length === 0" class="text-center text-muted my-4">
        Không tìm thấy cửa hàng phù hợp.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $toast, $repositories }: any = useNuxtApp()
const router = useRouter()

const shops = ref<any[]>([])
const searchKeyword = ref('')

const promos = ref([
  { title: 'Brand đỉnh deal đậm', image: '/img/1750687894064-download.jfif' },
  { title: 'Vùng deal siêu đậm', image: '/img/1750687894064-download.jfif' },
  { title: 'City Must Try', image: '/img/1750687894064-download.jfif' },
  { title: 'Ưu đãi GrabUnlimited', image: '/img/1750687894064-download.jfif' },
  { title: 'Đặt đông giảm đậm', image: '/img/1750687894064-download.jfif' },
  { title: 'Ngàn món chay ngon', image: '/img/1750687894064-download.jfif' },
])

const goToShopDetail = (shopId: string) => {
  router.push(`/shop/${shopId}`)
}

const statusVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'deactive':
      return 'secondary'
    case 'pending':
      return 'warning'
    default:
      return 'light'
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN')
}

const filteredShops = computed(() => {
  if (!searchKeyword.value.trim()) return shops.value
  const keyword = searchKeyword.value.toLowerCase()
  return shops.value.filter(shop =>
    shop.shopName?.toLowerCase().includes(keyword)
  )
})

onMounted(async () => {
  shops.value = await $repositories.shopRepository.getShopsByStatusName('active')
  $toast.success('Lấy danh sách cửa hàng thành công!')
})
</script>

<style scoped>
.search-wrapper {
  width: 100%;
  max-width: 600px;
  border-radius: 999px;
}

.search-bar-container .form-control {
  border-radius: 999px;
  padding: 10px 20px;
  background-color: #f5f5f5;
}

.promo-wrapper {
  width: 100%;
}

.promo-categories {
  max-width: 100%;
  padding: 0 10px;
}

.promo-item {
  width: 160px;
  height: 90px;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  flex: 0 0 auto;
}

.promo-item .overlay {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  padding: 0 10px;
}

.shop-card {
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.shop-card:hover {
  transform: translateY(-3px);
}

.shop-image {
  height: 180px;
  object-fit: cover;
}

.search-wrapper {
  width: 100%;
  max-width: 600px;
  border-radius: 999px;
  border: 1px solid #ccc;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.input-group-text,
.search-wrapper .form-control {
  border: none !important;
  border-radius: 0 !important;
  background-color: transparent;
  box-shadow: none;
}
</style>
