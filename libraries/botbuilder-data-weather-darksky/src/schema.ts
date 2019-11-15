/**
 * @module botbuildercommunity/data-weather-darksky
 */

export interface DarkSkySettings {
  key: string;
}

export interface WeatherForecast {
  summary: string;
  temperature: number;
  precipitation: number;
  precipitationType: string;
  humidity: number;
  wind: number;
  gusts: number;
  direction: number;
  coverage: number;
  visibility: number;
}

export interface IDarkSkyForecast {
  latitude: number;
  longitude: number;
  timezone: string;
  currently: IDarkSkyCurrentForecast;
  minutely: IDarkSkyFutureForecast;
  hourly: IDarkSkyFutureForecast;
  daily: IDarkSkyFutureForecast;
  alerts: IDarkSkyAlert[];
  flags: any;
}

export interface IDarkSkyCurrentForecast {
  time: number;
  summary: string;
  icon: string;
  nearestStormDistance: number;
  precipIntensity: number;
  precipIntensityError: number;
  precipProbability: number;
  precipType: string;
  temperature: number;
  apparentTemperature: number;
  dewPoint: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windGust: number;
  windBearing: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;
  ozone: number;
}

export interface IDarkSkyFutureForecast {
  summary: string;
  icon: string;
  data: IDarkSkyData[];
}

export interface IDarkSkyData {
  time: number;
  summary: string;
  icon: string;
  sunriseTime: number;
  sunsetTime: number;
  moonPhase: number;
  precipIntensity: number;
  precipIntensityMax: number;
  precipIntensityMaxTime: number;
  precipProbability: number;
  precipType: string;
  temperatureHigh: number;
  temperatureHighTime: number;
  temperatureLow: number;
  temperatureLowTime: number;
  apparentTemperatureHigh: number;
  apparentTemperatureHighTime: number;
  apparentTemperatureLow: number;
  apparentTemperatureLowTime: number;
  dewPoint: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windGust: number;
  windGustTime: number;
  windBearing: number;
  cloudCover: number;
  uvIndex: number;
  uvIndexTime: number;
  visibility: number;
  ozone: number;
  temperatureMin: number;
  temperatureMinTime: number;
  temperatureMax: number;
  temperatureMaxTime: number;
  apparentTemperatureMin: number;
  apparentTemperatureMinTime: number;
  apparentTemperatureMax: number;
  apparentTemperatureMaxTime: number;
}

export interface IDarkSkyAlert {
  title: string;
  time: number;
  expires: number;
  description: string;
  uri: string;
}
