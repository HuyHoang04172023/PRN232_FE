export const shopRepository = ($api: any) => {
    const path = '/Shops';

    return {
        async fetchShops(): Promise<any[]> {
            return $api.get(`${path}`).then((response: any) => response.data);
        },
        async getShopsByStatusName(statusName: string): Promise<any[]> {
            return $api.get(`${path}/status/${statusName}`).then((response: any) => response.data);
        },
        async createShop(data: any): Promise<any> {
            return $api.post(`${path}`, data)
        },
        async getShopByUserId(userId: number): Promise<any> {
            return $api.get(`${path}/${userId}`).then((response: any) => response.data)
        },
        async getShopInfoByShopId(shopId: number): Promise<any> {
            return $api.get(`${path}/shop-info/${shopId}`).then((response: any) => response.data)
        },
        async updateShopByShopId(shopId: number, data: any): Promise<any> {
            return $api.put(`${path}/${shopId}`, data).then((response: any) => response.data);
        },
        async deleteShopByShopId(shopId: number): Promise<any> {
            return $api.delete(`${path}/${shopId}`).then((response: any) => response.data)
        },
        async updateStatusShopByShopId(shopId: number, statusName: string): Promise<any> {
            return $api.post(`${path}/update-status/${shopId}?statusName=${statusName}`)
                .then((response: any) => response.data)
        },
        async getShopIdByProductId(productId: number): Promise<any> {
            return $api.get(`${path}/shop-id/${productId}`).then((response: any) => response.data)
        },
    };
};