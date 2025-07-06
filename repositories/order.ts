export const orderRepository = ($api: any) => {
    const path = '/Order';

    return {
        async createOrder(data: any): Promise<any> {
            return $api.post(`${path}`, data)
        },
        async getOrdersByUserId(userId: number): Promise<any> {
            return $api.get(`${path}/user/${userId}`).then((response: any) => response.data)
        },
        async getOrderByOrderId(orderId: number): Promise<any> {
            return $api.get(`${path}/${orderId}`).then((response: any) => response.data)
        },
        async updateStatusOrderByOrderId(orderId: number, statusName: string): Promise<any> {
            return $api.put(`${path}/update-status/${orderId}?statusName=${statusName}`)
                .then((response: any) => response.data)
        },
    };
};