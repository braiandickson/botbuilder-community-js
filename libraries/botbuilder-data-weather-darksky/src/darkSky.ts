import * as request from 'request-promise';
import { DarkSkySettings, IDarkSkyForecast } from './schema';

/**
 * @module botbuildercommunity/data-weather-darksky
 */

 export class DarkSkyClient {
     private settings: DarkSkySettings;
     public constructor(settings: DarkSkySettings) {
        this.settings = settings;
     }
     public async getForecast(latitude: number, longitude: number): Promise<DarkSkyForecast> {
        const opts = {
            uri: `https://api.darksky.net/forecast/${this.settings.key}/${latitude},${longitude}`,
            method: 'GET',
            resolveWithFullResponse: true
        }
        const res = await request(opts);
        const data: IDarkSkyForecast = res.body;
        return new DarkSkyForecast(data);
     }
}

export class DarkSkyForecast {
    private forecast: IDarkSkyForecast;
    public readonly latitude: number;
    public readonly longitude: number;
    public constructor(data: IDarkSkyForecast) {
        this.latitude = this.forecast.latitude;
        this.longitude = this.forecast.longitude;
    }
}
