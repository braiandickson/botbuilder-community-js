import * as request from 'request-promise';
import { DarkSkySettings, IDarkSkyForecast, WeatherForecast, IDarkSkyAlert, PRECIPITATION, IDarkSkyData, FutureWeatherForecast, TIMEFRAME, IDarkSkyFutureForecast } from './schema';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const spacetime = require('spacetime');

/**
 * @module botbuildercommunity/data-weather-darksky
 */

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
        if(data != null) {
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
        return null;
    }
    private getTimeframeForecast(timeframe: string): IDarkSkyFutureForecast {
        const fore: IDarkSkyForecast = this.forecast;
        return fore[timeframe] as IDarkSkyFutureForecast;
    }
    /*
     * Need to take into account hourly when the day is the current day.
     * Need to take into account minute when the hour is the current hour.
     */
    public nextRain(threshold: number = 0.5): FutureWeatherForecast {
        const rain: IDarkSkyData = this.forecast.daily.data.find((e: IDarkSkyData): boolean => e.precipProbability >= threshold && e.precipType === PRECIPITATION.RAIN);
        return this.getFutureWeatherForecast(rain);
    }
    public nextSnow(threshold: number = 0.5): FutureWeatherForecast {
        const snow: IDarkSkyData = this.forecast.daily.data.find((e: IDarkSkyData): boolean => e.precipProbability >= threshold && e.precipType === PRECIPITATION.SNOW);
        return this.getFutureWeatherForecast(snow);
    }
    public nextPrecipitation(threshold: number = 0.5): FutureWeatherForecast {
        const prec: IDarkSkyData = this.forecast.daily.data.find((e: IDarkSkyData): boolean => e.precipProbability >= threshold);
        return this.getFutureWeatherForecast(prec);
    }
    public nextHighHumidity(threshold: number = 0.5): FutureWeatherForecast {
        const fore: IDarkSkyData = this.forecast.daily.data.find((e: IDarkSkyData): boolean => e.humidity >= threshold);
        return this.getFutureWeatherForecast(fore);
    }
    public nextLowVisibility(threshold: number = 0.5): FutureWeatherForecast {
        const fore: IDarkSkyData = this.forecast.daily.data.find((e: IDarkSkyData): boolean => e.visibility <= threshold);
        return this.getFutureWeatherForecast(fore);
    }
    public nextBadWeather(precipThreshold: number = 0.5, clarityThreshold: number = 0.5, windThreshold: number = 10): FutureWeatherForecast {
        const fore: IDarkSkyData = this.forecast.daily.data.find((e: IDarkSkyData): boolean => {
            return e.precipProbability >= precipThreshold
                || e.visibility <= clarityThreshold
                || e.windSpeed >= windThreshold;
        });
        return this.getFutureWeatherForecast(fore);
    }
    public nextSunnyWeather(threshold: number = 0.5): FutureWeatherForecast {
        const fore: IDarkSkyData = this.forecast.daily.data.find((e: IDarkSkyData): boolean => e.cloudCover <= threshold);
        return this.getFutureWeatherForecast(fore);
    }
    public nextWindyWeather(threshold: number = 10): FutureWeatherForecast {
        const fore: IDarkSkyData = this.forecast.daily.data.find((e: IDarkSkyData): boolean => e.windSpeed >= threshold);
        return this.getFutureWeatherForecast(fore);
    }
    public hottest(timeframe: TIMEFRAME = TIMEFRAME.DAILY): FutureWeatherForecast {
        const fore = this.getTimeframeForecast(timeframe);
        const prop = (timeframe === TIMEFRAME.DAILY) ? 'temperatureHigh' : 'temperature';
        const high: number = Math.max(...fore.data.map((e: IDarkSkyData): number => e[prop]));
        const result: IDarkSkyData = fore.data.find((e: IDarkSkyData): boolean => e[prop] === high);
        return this.getFutureWeatherForecast(result);
    }
    public coldest(timeframe: TIMEFRAME = TIMEFRAME.DAILY): FutureWeatherForecast {
        const fore = this.getTimeframeForecast(timeframe);
        const prop = (timeframe === TIMEFRAME.DAILY) ? 'temperatureLow' : 'temperature';
        const low: number = Math.min(...fore.data.map((e: IDarkSkyData): number => e[prop]));
        const result: IDarkSkyData = fore.data.find((e: IDarkSkyData): boolean => e[prop] === low);
        return this.getFutureWeatherForecast(result);
    }
    public wettest(timeframe: TIMEFRAME = TIMEFRAME.DAILY): FutureWeatherForecast {
        const fore = this.getTimeframeForecast(timeframe);
        const high: number = Math.max(...fore.data.map((e: IDarkSkyData): number => e.precipProbability));
        const result: IDarkSkyData = fore.data.find((e: IDarkSkyData): boolean => e.precipProbability === high);
        return this.getFutureWeatherForecast(result);
    }
    public driest(timeframe: TIMEFRAME = TIMEFRAME.DAILY): FutureWeatherForecast {
        const fore = this.getTimeframeForecast(timeframe);
        const low: number = Math.min(...fore.data.map((e: IDarkSkyData): number => e.precipProbability));
        const result: IDarkSkyData = fore.data.find((e: IDarkSkyData): boolean => e.precipProbability === low);
        return this.getFutureWeatherForecast(result);
    }
    public hardest(timeframe: TIMEFRAME = TIMEFRAME.DAILY): FutureWeatherForecast {
        const fore = this.getTimeframeForecast(timeframe);
        const high: number = Math.max(...fore.data.map((e: IDarkSkyData): number => e.precipIntensityMax));
        const result: IDarkSkyData = fore.data.find((e: IDarkSkyData): boolean => e.precipIntensityMax === high);
        return this.getFutureWeatherForecast(result);
    }
    public lightest(timeframe: TIMEFRAME = TIMEFRAME.DAILY): FutureWeatherForecast {
        const fore = this.getTimeframeForecast(timeframe);
        const low: number = Math.min(...fore.data.map((e: IDarkSkyData): number => e.precipIntensityMax));
        const result: IDarkSkyData = fore.data.find((e: IDarkSkyData): boolean => e.precipIntensityMax === low);
        return this.getFutureWeatherForecast(result);
    }
    public sunniest(timeframe: TIMEFRAME = TIMEFRAME.DAILY): FutureWeatherForecast {
        const fore = this.getTimeframeForecast(timeframe);
        const low: number = Math.min(...fore.data.map((e: IDarkSkyData): number => e.cloudCover));
        const result: IDarkSkyData = fore.data.find((e: IDarkSkyData): boolean => e.cloudCover === low);
        return this.getFutureWeatherForecast(result);
    }
    public cloudiest(timeframe: TIMEFRAME = TIMEFRAME.DAILY): FutureWeatherForecast {
        const fore = this.getTimeframeForecast(timeframe);
        const high: number = Math.max(...fore.data.map((e: IDarkSkyData): number => e.cloudCover));
        const result: IDarkSkyData = fore.data.find((e: IDarkSkyData): boolean => e.cloudCover === high);
        return this.getFutureWeatherForecast(result);
    }
    public windiest(timeframe: TIMEFRAME = TIMEFRAME.DAILY): FutureWeatherForecast {
        const fore = this.getTimeframeForecast(timeframe);
        const high: number = Math.max(...fore.data.map((e: IDarkSkyData): number => e.windSpeed));
        const result: IDarkSkyData = fore.data.find((e: IDarkSkyData): boolean => e.windSpeed === high);
        return this.getFutureWeatherForecast(result);
    }
    public calmest(timeframe: TIMEFRAME = TIMEFRAME.DAILY): FutureWeatherForecast {
        const fore = this.getTimeframeForecast(timeframe);
        const low: number = Math.min(...fore.data.map((e: IDarkSkyData): number => e.windSpeed));
        const result: IDarkSkyData = fore.data.find((e: IDarkSkyData): boolean => e.windSpeed === low);
        return this.getFutureWeatherForecast(result);
    }
    public humidest(timeframe: TIMEFRAME = TIMEFRAME.DAILY): FutureWeatherForecast {
        const fore = this.getTimeframeForecast(timeframe);
        const high: number = Math.max(...fore.data.map((e: IDarkSkyData): number => e.humidity));
        const result: IDarkSkyData = fore.data.find((e: IDarkSkyData): boolean => e.humidity === high);
        return this.getFutureWeatherForecast(result);
    }
    public aridest(timeframe: TIMEFRAME = TIMEFRAME.DAILY): FutureWeatherForecast {
        const fore = this.getTimeframeForecast(timeframe);
        const low: number = Math.min(...fore.data.map((e: IDarkSkyData): number => e.humidity));
        const result: IDarkSkyData = fore.data.find((e: IDarkSkyData): boolean => e.humidity === low);
        return this.getFutureWeatherForecast(result);
    }
    public getCurrentSummary(): string {
        return this.forecast.currently.summary;
    }
    public getTodaysSummary(): string {
        return this.forecast.daily.summary;
    }
    public getCurrentForecast(): WeatherForecast {
        return this.weather;
    }
    public getTodaysForecast(): FutureWeatherForecast {
        return this.getFutureWeatherForecast(this.forecast.daily.data[0]);
    }
    public getAlert(alert?: IDarkSkyAlert): string {
        try {
            const warning = alert || this.forecast.alerts[0];
            return `Warning (expires on ${ warning.expires }): ${ warning.description }`;
        }
        catch(e) {
            return 'No weather alerts for this time period.';
        }
    }
    public getAlerts(): string[] {
        const alerts: IDarkSkyAlert[] = this.forecast.alerts;
        if(alerts !== undefined) {
            return alerts.map((e: IDarkSkyAlert): string => this.getAlert(e));
        }
        return null;
    }
}

async function getDarkSkyForecast(latitude: number, longitude: number, settings: DarkSkySettings): Promise<DarkSkyForecast> {
    const opts = {
        uri: `https://api.darksky.net/forecast/${ settings.key }/${ latitude },${ longitude }`,
        method: 'GET',
        resolveWithFullResponse: true
    };
    const res = await request(opts);
    const data: IDarkSkyForecast = JSON.parse(res.body);
    return new DarkSkyForecast(data);
}

export class DarkSkyClient {
    private settings: DarkSkySettings;
    public constructor(settings: DarkSkySettings) {
        this.settings = settings;
    }
    private async getDarkSkyForecast(latitude: number, longitude: number): Promise<DarkSkyForecast> {
        return await getDarkSkyForecast(latitude, longitude, this.settings);
    }
    public async getForecast(latitude: number, longitude: number): Promise<DarkSkyForecast> {
        return await this.getDarkSkyForecast(latitude, longitude);
    }
}
