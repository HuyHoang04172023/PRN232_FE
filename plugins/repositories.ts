import { weatherRepository } from "~/repositories/weather";
import { shopRepository } from "~/repositories/shop";
import { productRepository } from "~/repositories/product";
import { configDataRepository } from "~/repositories/config-data";
import { cartRepository } from "~/repositories/cart";
import { orderRepository } from "~/repositories/order";
import { statisticalSaleRepository } from "~/repositories/statistis-sale";

export default defineNuxtPlugin({
    setup(nuxtApp) {
        const $api = nuxtApp.$api;

        const repositories = {
            weatherRepository: weatherRepository($api),
            shopRepository: shopRepository($api),
            productRepository: productRepository($api),
            configDataRepository: configDataRepository($api),
            cartRepository: cartRepository($api),
            orderRepository: orderRepository($api),
            statisticalSaleRepository: statisticalSaleRepository($api),
        };

        return {
            provide: { repositories: repositories }
        }
    }
});
