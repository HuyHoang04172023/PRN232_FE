
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
    };
};