export const shopRepository = ($api: any) => {
    const path = '/Shops';

    return {
        async fetchShops(): Promise<any[]> {
            return $api.get(`${path}`).then((response: any) => response.data);
        },
    };
};