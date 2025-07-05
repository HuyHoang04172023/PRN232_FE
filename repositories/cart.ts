export const cartRepository = ($api: any) => {
    const path = '/cart';

    return {
        async addProductToCart(userId: number, data: any): Promise<any> {
            return $api.post(`${path}/${userId}/add`, data)
        },
    };
}; 