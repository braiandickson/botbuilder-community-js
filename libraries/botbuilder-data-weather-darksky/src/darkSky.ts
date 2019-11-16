import * as request from 'request-promise';
import spacetime from 'spacetime';
import { DarkSkySettings, IDarkSkyForecast, WeatherForecast, IDarkSkyAlert, PRECIPITATION, IDarkSkyData, FutureWeatherForecast } from './schema';

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
    public nextRain(threshold: number = 0.5): FutureWeatherForecast {
        const rain: IDarkSkyData = this.forecast.daily.data.find((e) => e.precipProbability >= threshold && e.precipType === PRECIPITATION.RAIN);
        return {
            date: spacetime(rain.time).d,
            weather: {
                summary: rain.summary,
                temperatureHigh: rain.temperatureHigh,
                temperatureLow: rain.temperatureLow,
                precipitation: rain.precipProbability,
                precipitationType: rain.precipType,
                humidity: rain.humidity,
                wind: rain.windSpeed,
                gusts: rain.windGust,
                direction: rain.windBearing,
                coverage: rain.cloudCover,
                visibility: rain.visibility
            }
        };
    }
    public nextSnow(threshold: number = 0.5): FutureWeatherForecast {
        const snow: IDarkSkyData = this.forecast.daily.data.find((e) => e.precipProbability >= threshold && e.precipType === PRECIPITATION.SNOW);
        return {
            date: spacetime(snow.time).d,
            weather: {
                summary: snow.summary,
                temperatureHigh: snow.temperatureHigh,
                temperatureLow: snow.temperatureLow,
                precipitation: snow.precipProbability,
                precipitationType: snow.precipType,
                humidity: snow.humidity,
                wind: snow.windSpeed,
                gusts: snow.windGust,
                direction: snow.windBearing,
                coverage: snow.cloudCover,
                visibility: snow.visibility
            }
        };
    }
    public nextPrecipitation(threshold: number = 0.5): FutureWeatherForecast {
        const prec: IDarkSkyData = this.forecast.daily.data.find((e) => e.precipProbability >= threshold);
        return {
            date: spacetime(prec.time).d,
            weather: {
                summary: prec.summary,
                temperatureHigh: prec.temperatureHigh,
                temperatureLow: prec.temperatureLow,
                precipitation: prec.precipProbability,
                precipitationType: prec.precipType,
                humidity: prec.humidity,
                wind: prec.windSpeed,
                gusts: prec.windGust,
                direction: prec.windBearing,
                coverage: prec.cloudCover,
                visibility: prec.visibility
            }
        };
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
