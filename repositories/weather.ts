import type { Weather } from "~/types/weather";

export const weatherRepository = ($api: any) => {
    const path = '/WeatherForecast';

    return {
        async fetchWeathers(): Promise<Weather[]> {
            return $api.get(`${path}`).then((response: any) => response.data);
        },
    };
};