export const orderRepository = ($api: any) => {
    const path = '/Order';

    return {
        async createOrder(data: any): Promise<any> {
            return $api.post(`${path}`, data)
        },
        async getOrdersByUserId(userId: number): Promise<any> {
            return $api.get(`${path}/user/${userId}`).then((response: any) => response.data)
        },
    };
};