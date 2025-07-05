export const orderRepository = ($api: any) => {
    const path = '/order';

    return {
        async createOrder(data: any): Promise<any> {
            return $api.post(`${path}`, data)
        },
    };
};