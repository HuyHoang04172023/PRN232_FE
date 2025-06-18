<template>
  <div class="container mt-5">
    <h2 class="mb-4">Danh sách cửa hàng</h2>

    <table class="table table-bordered table-hover align-middle">
      <thead class="table-dark">
        <tr>
          <th>ShopId</th>
          <th>Tên cửa hàng</th>
          <th>Địa chỉ</th>
          <th>Hình ảnh</th>
          <th>Mô tả</th>
          <th>Người tạo</th>
          <th>Trạng thái</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="shop in shops" :key="shop.shopId">
          <td>{{ shop.shopId }}</td>
          <td>{{ shop.shopName }}</td>
          <td>{{ shop.shopAddress }}</td>
          <td>
            <img :src="shop.shopImage" alt="Ảnh" style="width: 80px; height: 80px; object-fit: cover" class="rounded" />
          </td>
          <td>{{ shop.shopDescription }}</td>
          <td>{{ shop.createdBy }}</td>
          <td>
            <span :class="getStatusClass(shop.statusShop)">
              {{ shop.statusShop }}
            </span>
          </td>
          <td>
            <button class="btn btn-success btn-sm me-2" @click="updateStatus(shop.shopId, 'active')" title="Duyệt">
              <i class="bi bi-check-circle-fill"></i>
            </button>
            <button class="btn btn-danger btn-sm" @click="updateStatus(shop.shopId, 'reject')" title="Không duyệt">
              <i class="bi bi-x-circle-fill"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const { $toast, $repositories }: any = useNuxtApp();

const shops = ref<any[]>([]);

const fetchShops = async () => {
  try {
    shops.value = shops.value = await $repositories.shopRepository.getShopsByStatusName("pending");
  } catch (err) {
  }
}

onMounted(fetchShops)

const updateStatus = async (shopId: number, statusName: string) => {
  try {
    await $repositories.shopRepository.updateStatusShopByShopId(shopId, statusName);
    await fetchShops()
    $toast.success("Cập nhật trạng thái thành công!")
  } catch (err) {
  }
}

const getStatusClass = (status: string) => {
  if (status === 'active') return 'badge bg-success'
  if (status === 'pending') return 'badge bg-warning text-dark'
  if (status === 'rejected') return 'badge bg-danger'
  return 'badge bg-secondary'
}
</script>
