<template>
  <div class="container mt-5">
    <h2 class="mb-4">Danh sách sản phẩm chờ duyệt</h2>

    <table class="table table-bordered table-hover align-middle">
      <thead class="table-dark">
        <tr>
          <th>Id</th>
          <th>Tên sản phẩm</th>
          <th>Mô tả sản phẩm</th>
          <th>Hình ảnh</th>
          <th>Tên cửa hàng</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="products.length === 0">
          <td colspan="8" class="text-center text-muted">Không có sản phẩm nào đang chờ duyệt.</td>
        </tr>
        <tr v-else v-for="product in products" :key="product.productId">
          <td>{{ product.productId }}</td>
          <td>{{ product.productName }}</td>
          <td>{{ product.productDescription }}</td>
          <td>
            <img :src="product.productImage" alt="Ảnh" style="width: 80px; height: 80px; object-fit: cover" class="rounded" />
          </td>
          <td>{{ product.shopName }}</td>
          <td>
            <button class="btn btn-success btn-sm me-2" @click="updateStatus(product.productId, 'active')" title="Duyệt">
              <i class="bi bi-check-circle-fill"></i>
            </button>
            <button class="btn btn-danger btn-sm" @click="updateStatus(product.productId, 'reject')" title="Không duyệt">
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

const products = ref<any[]>([]);

const fetchProducts = async () => {
  try {
    products.value = await $repositories.productRepository.getProductsByStatusName("pending");
  } catch (err) {
  }
}

onMounted(fetchProducts)

const updateStatus = async (productId: number, statusName: string) => {
  try {
    await $repositories.productRepository.updateStatusProductByProductId(productId, statusName);
    await fetchProducts()
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
