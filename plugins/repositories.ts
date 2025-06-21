import { weatherRepository } from "~/repositories/weather";
import { shopRepository } from "~/repositories/shop";
import { productRepository } from "~/repositories/product";

export default defineNuxtPlugin({
    setup(nuxtApp) {
        const $api = nuxtApp.$api;

        const repositories = {
            weatherRepository: weatherRepository($api),
            shopRepository: shopRepository($api),
            productRepository: productRepository($api),
        };

        return {
            provide: { repositories: repositories }
        }
    }
});
