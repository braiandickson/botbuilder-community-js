import * as request from 'request-promise';
import spacetime from 'spacetime';
import { DarkSkySettings, IDarkSkyForecast, WeatherForecast, IDarkSkyAlert, PRECIPITATION, IDarkSkyData, FutureWeatherForecast, TIMEFRAME } from './schema';

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
    private getFutureWeatherForecast(data: IDarkSkyData): FutureWeatherForecast {
        return {
            date: spacetime(data.time).d,
            weather: {
                summary: data.summary,
                temperatureHigh: data.temperatureHigh,
                temperatureLow: data.temperatureLow,
                precipitation: data.precipProbability,
                precipitationType: data.precipType,
                humidity: data.humidity,
                wind: data.windSpeed,
                gusts: data.windGust,
                direction: data.windBearing,
                coverage: data.cloudCover,
                visibility: data.visibility
            }
        };
    }
    /*
     * Need to take into account hourly when the day is the current day.
     * Need to take into account minute when the hour is the current hour.
     */
    public nextRain(threshold: number = 0.5): FutureWeatherForecast {
        const rain: IDarkSkyData = this.forecast.daily.data.find((e) => e.precipProbability >= threshold && e.precipType === PRECIPITATION.RAIN);
        return this.getFutureWeatherForecast(rain);
    }
    public nextSnow(threshold: number = 0.5): FutureWeatherForecast {
        const snow: IDarkSkyData = this.forecast.daily.data.find((e) => e.precipProbability >= threshold && e.precipType === PRECIPITATION.SNOW);
        return this.getFutureWeatherForecast(snow);
    }
    public nextPrecipitation(threshold: number = 0.5): FutureWeatherForecast {
        const prec: IDarkSkyData = this.forecast.daily.data.find((e) => e.precipProbability >= threshold);
        return this.getFutureWeatherForecast(prec);
    }
    public nextHighHumidity(threshold: number = 0.5): FutureWeatherForecast {
        const prec: IDarkSkyData = this.forecast.daily.data.find((e) => e.humidity >= threshold);
        return this.getFutureWeatherForecast(prec);
    }
    public nextLowVisibility(threshold: number = 0.5): FutureWeatherForecast {
        const prec: IDarkSkyData = this.forecast.daily.data.find((e) => e.visibility <= threshold);
        return this.getFutureWeatherForecast(prec);
    }
    public nextBadWeather(precipThreshold: number = 0.5, clarityThreshold: number = 0.5, windThreshold: number = 10): FutureWeatherForecast {
        const prec: IDarkSkyData = this.forecast.daily.data.find((e) => {
            return e.precipProbability >= precipThreshold
                && e.visibility <= clarityThreshold
                && e.windSpeed >= windThreshold;
        });
        return this.getFutureWeatherForecast(prec);
    }
    public nextSunnyWeather(threshold: number = 75): FutureWeatherForecast {
        const prec: IDarkSkyData = this.forecast.daily.data.find((e) => e.visibility >= threshold);
        return this.getFutureWeatherForecast(prec);
    }
    public nextWindyWeather(threshold: number = 10): FutureWeatherForecast {
        const prec: IDarkSkyData = this.forecast.daily.data.find((e) => e.windSpeed >= threshold);
        return this.getFutureWeatherForecast(prec);
    }
    public hottest(timeframe: TIMEFRAME = TIMEFRAME.TODAY): FutureWeatherForecast {

    }
    public coldest(timeframe: TIMEFRAME = TIMEFRAME.TODAY): FutureWeatherForecast {

    }
    public wettest(timeframe: TIMEFRAME = TIMEFRAME.TODAY): FutureWeatherForecast {

    }
    public driest(timeframe: TIMEFRAME = TIMEFRAME.TODAY): FutureWeatherForecast {

    }
    public sunniest(timeframe: TIMEFRAME = TIMEFRAME.TODAY): FutureWeatherForecast {

    }
    public cloudiest(timeframe: TIMEFRAME = TIMEFRAME.TODAY): FutureWeatherForecast {

    }
    public windiest(timeframe: TIMEFRAME = TIMEFRAME.TODAY): FutureWeatherForecast {

    }
    public humidest(timeframe: TIMEFRAME = TIMEFRAME.TODAY): FutureWeatherForecast {

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
