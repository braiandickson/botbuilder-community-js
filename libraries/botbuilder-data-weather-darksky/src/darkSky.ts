import * as request from 'request-promise';
import { DarkSkySettings, IDarkSkyForecast, WeatherForecast, IDarkSkyAlert } from './schema';

/**
 * @module botbuildercommunity/data-weather-darksky
 */

 export class DarkSkyClient {
     private settings: DarkSkySettings;
     public constructor(settings: DarkSkySettings) {
        this.settings = settings;
     }
     private async getDarkSkyForecast(latitude: number, longitude: number): Promise<DarkSkyForecast> {
        const opts = {
            uri: `https://api.darksky.net/forecast/${this.settings.key}/${latitude},${longitude}`,
            method: 'GET',
            resolveWithFullResponse: true
        }
        const res = await request(opts);
        const data: IDarkSkyForecast = res.body;
        return new DarkSkyForecast(data);
     }
     public async getForecast(latitude: number, longitude: number): Promise<DarkSkyForecast> {
        return this.getDarkSkyForecast(latitude, longitude);
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
            summary: this.forecast.currently.summary,
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
    public getCurrentSummary(): string {
        return this.forecast.currently.summary;
    }
    public getTodaysSummary(): string {
        return this.forecast.daily[0].summary;

    }
    public getCurrentForecast(): WeatherForecast {
        return this.weather;
    }
    public getTodaysForecast(): WeatherForecast {
        return {
            summary: this.forecast.daily[0].summary,
            temperature: this.forecast.daily[0].temperature,
            precipitation: this.forecast.daily[0].precipProbability,
            precipitationType: this.forecast.daily[0].precipType,
            humidity: this.forecast.daily[0].humidity,
            wind: this.forecast.daily[0].windSpeed,
            gusts: this.forecast.daily[0].windGust,
            direction: this.forecast.daily[0].windBearing,
            coverage: this.forecast.daily[0].cloudCover,
            visibility: this.forecast.daily[0].visibility
        };

    }
    public getAlert(alert?: IDarkSkyAlert): string {
        const warning = alert || this.forecast.alerts[0];
        return `Warning (expires on ${warning.expires}): ${warning.description}`;
    }
    public getAlerts(): string[] {
        const alerts: IDarkSkyAlert[] = this.forecast.alerts;
        return alerts.map((e: IDarkSkyAlert) => this.getAlert(e));
    }
}
