import * as request from 'request-promise';
import { DarkSkySettings, IDarkSkyForecast, WeatherForecast } from './schema';

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
    public readonly weather: WeatherForecast;
    public readonly latitude: number;
    public readonly longitude: number;
    public constructor(forecast: IDarkSkyForecast) {
        this.forecast = forecast;
        this.latitude = this.forecast.latitude;
        this.longitude = this.forecast.longitude;
        this.weather = {
            temperature: this.forecast.currently.temperature,
            precipitation: this.forecast.currently.precipProbability,
            precipitationType: this.forecast.currently.precipType,
            humidity: this.forecast.currently.humidity,
            wind: this.forecast.currently.windSpeed,
            gusts: this.forecast.currently.windGust,
            direction: this.forecast.currently.windBearing,
            coverage: this.forecast.currently.cloudCover,
            visibility: this.forecast.currently.visibility
        };
    }
    public nextRain() {

    }
    public nextSnow() {

    }
    public nextPrecipitation() {

    }
    public nextBadWeather() {

    }
    public nextSunnyDay() {
        
    }
    public nextWindyDay() {
        
    }
}
