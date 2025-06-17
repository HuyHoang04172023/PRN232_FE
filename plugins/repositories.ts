import { weatherRepository } from "~/repositories/weather";
import { shopRepository } from "~/repositories/shop";


export default defineNuxtPlugin({
    setup(nuxtApp) {
        const $api = nuxtApp.$api;

        const repositories = {
            weatherRepository: weatherRepository($api),
            shopRepository: shopRepository($api),
        };

        return {
            provide: { repositories: repositories }
        }
    }
});
