export const configDataRepository = ($api: any) => {
    const path = '/ConfigData';

    return {
        async fetchProductSizes(): Promise<any[]> {
            return $api.get(`${path}/sizes`).then((response: any) => response.data);
        },
    };
}; 