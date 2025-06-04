import { weatherRepository } from "~/repositories/weather";

export default defineNuxtPlugin({
    setup(nuxtApp) {
        const $api = nuxtApp.$api;

        const repositories = {
            weatherRepository: weatherRepository($api),
        };

        return {
            provide: { repositories: repositories }
        }
    }
});
