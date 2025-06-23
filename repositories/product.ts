export const productRepository = ($api: any) => {
    const path = '/Products';

    return {
        async getProductsByStatusName(statusName: string): Promise<any[]> {
            return $api.get(`${path}/status/${statusName}`).then((response: any) => response.data);
        },
        async getProductByProductId(productId: number): Promise<any> {
            return $api.get(`${path}/${productId}`).then((response: any) => response.data)
        },
        async createProduct(data: any): Promise<any> {
            return $api.post(`${path}`, data)
        },
        async updateProductByProductId(productId: number, data: any): Promise<any> {
            return $api.put(`${path}/${productId}`, data).then((response: any) => response.data);
        },
    };
};