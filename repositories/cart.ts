export const cartRepository = ($api: any) => {
    const path = '/cart';

    return {
        async getCartBByUserId(userId: number): Promise<any> {
            return $api.get(`${path}/${userId}`).then((response: any) => response.data)
        },
        async addProductToCart(userId: number, data: any): Promise<any> {
            return $api.post(`${path}/${userId}/add`, data)
        },
        async updateProductInCart(userId: number, data: any): Promise<any> {
            return $api.put(`${path}/${userId}/update`, data)
        },
        async deleteProductInCart(userId: number, variantId: number): Promise<any> {
            return $api.delete(`${path}/${userId}/remove/${variantId}`)
        },
    };
}; 