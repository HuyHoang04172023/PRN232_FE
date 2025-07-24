
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
    };
};