
export const statisticalSaleRepository = ($api: any) => {
    const path = '/StatisticalSale';

    return {
        async revenueByMonth(shopId: number): Promise<any[]> {
            return $api.get(`${path}/revenue-by-month/${shopId}`).then((response: any) => response.data);
        },
        async dailyRevenue(shopId: number, year: number, month : number): Promise<any> {
            return $api.get(`${path}/daily-revenue/${shopId}?year=${year}&month=${month}`)
                .then((response: any) => response.data)
        },
        async topProducts(shopId: number): Promise<any[]> {
            return $api.get(`${path}/top-products/${shopId}`).then((response: any) => response.data);
        },
        async productLikesRatio(shopId: number): Promise<any[]> {
            return $api.get(`${path}/product-likes-ratio/${shopId}`).then((response: any) => response.data);
        },
        async ordersByStatus(shopId: number): Promise<any[]> {
            return $api.get(`${path}/orders-by-status/${shopId}`).then((response: any) => response.data);
        },
        async ordersSummary(shopId: number): Promise<any[]> {
            return $api.get(`${path}/orders/summary/${shopId}`).then((response: any) => response.data);
        },
        async ordersByMonth(shopId: number): Promise<any[]> {
            return $api.get(`${path}/orders/by-month/${shopId}`).then((response: any) => response.data);
        },
        async ordersStatusMonthly(shopId: number): Promise<any[]> {
            return $api.get(`${path}/orders/status-monthly/${shopId}`).then((response: any) => response.data);
        },
    };
};