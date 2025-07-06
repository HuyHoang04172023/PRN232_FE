export const configDataRepository = ($api: any) => {
    const path = '/ConfigData';

    return {
        async fetchProductSizes(): Promise<any[]> {
            return $api.get(`${path}/sizes`).then((response: any) => response.data);
        },
        async fetchStatusOrders(): Promise<any[]> {
            return $api.get(`${path}/status-orders`).then((response: any) => response.data);
        },
    };
}; 