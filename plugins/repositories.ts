import { weatherRepository } from "~/repositories/weather";
import { shopRepository } from "~/repositories/shop";
import { productRepository } from "~/repositories/product";
import { configDataRepository } from "~/repositories/config-data";

export default defineNuxtPlugin({
    setup(nuxtApp) {
        const $api = nuxtApp.$api;

        const repositories = {
            weatherRepository: weatherRepository($api),
            shopRepository: shopRepository($api),
            productRepository: productRepository($api),
            configDataRepository: configDataRepository($api),
        };

        return {
            provide: { repositories: repositories }
        }
    }
});
