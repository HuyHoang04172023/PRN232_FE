
export const statisticalAdminRepository = ($api: any) => {
    const path = '/StatisticalAdmin';

    return {
        async shopByStatus(): Promise<any[]> {
            return $api.get(`${path}/shop/shops-by-status`).then((response: any) => response.data);
        },
        async revenueByShop(): Promise<any[]> {
            return $api.get(`${path}/shop/revenue-by-shop-variant`).then((response: any) => response.data);
        },
        async ordersByShop(): Promise<any[]> {
            return $api.get(`${path}/shop/orders-by-shop`).then((response: any) => response.data);
        },
        async productsByShop(): Promise<any[]> {
            return $api.get(`${path}/shop/products-by-shop`).then((response: any) => response.data);
        },
        async newShopsPerMonth(): Promise<any[]> {
            return $api.get(`${path}/shop/new-shops-per-month`).then((response: any) => response.data);
        },

        async newUsersPerMonth(): Promise<any[]> {
            return $api.get(`${path}/user/new-users-per-month`).then((response: any) => response.data);
        },
        async topUsersByOrders(): Promise<any[]> {
            return $api.get(`${path}/user/top-users-by-orders`).then((response: any) => response.data);
        },
        async shopsByUser(): Promise<any[]> {
            return $api.get(`${path}/user/shops-by-user`).then((response: any) => response.data);
        },
        async usersByRole(): Promise<any[]> {
            return $api.get(`${path}/user/users-by-role`).then((response: any) => response.data);
        },

        async productsByStatus(): Promise<any[]> {
            return $api.get(`${path}/product/products-by-status`).then((response: any) => response.data);
        },
        async topSellingProducts(): Promise<any[]> {
            return $api.get(`${path}/product/top-selling-products`).then((response: any) => response.data);
        },
        async productsByShop2(): Promise<any[]> {
            return $api.get(`${path}/product/products-by-shop`).then((response: any) => response.data);
        },
        async newProductsPerMonth(): Promise<any[]> {
            return $api.get(`${path}/product/new-products-per-month`).then((response: any) => response.data);
        },
    };
};