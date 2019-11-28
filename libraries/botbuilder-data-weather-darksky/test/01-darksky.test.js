const assert = require('assert');
const rewire = require("rewire");
const darksky = rewire("../lib/darksky");

const data = require('./data.json');

const settings = {
    key: 'abcdefghijklmnopqrstuvwxyz'
};

const getDarkSkyForecast = async function(latitude, longitude, settings) {
    return await Promise.resolve(new darksky.DarkSkyForecast(data));
}

darksky.__set__("getDarkSkyForecast", getDarkSkyForecast);

describe('Tests for the DarkSkyClient', () => {
    it('should create a client', () => {
        const client = new darksky.DarkSkyClient(settings);
        assert.notEqual(client, null);
    });
    it('should create the forecast from the client', async () => {
        const client = new darksky.DarkSkyClient(settings);
        const f = await client.getForecast(1, 1);
        assert.notEqual(f.forecast, null);
        assert.equal(f.forecast.timezone, 'America/Los_Angeles');
    });
});

describe('Tests for the DarkSkyForecast', () => {
    it('should create a forecast', () => {
        const f = new darksky.DarkSkyForecast(data);
        assert.notEqual(f, null);
        assert.equal(f.forecast.timezone, 'America/Los_Angeles');
    });
});

describe('Tests for the DarkSkyForecast properties', () => {
    const forecast = new darksky.DarkSkyForecast(data);
    it('should have a latitude property', () => {
        assert.equal(forecast.latitude, 37.8267);
    });
    it('should have a longitude property', () => {
        assert.equal(forecast.longitude, -122.4233);
    });
    it('should have a weather property', () => {
        assert.notEqual(forecast.weather, null);
        assert.equal(forecast.weather.summary, 'Clear');
        assert.equal(forecast.weather.temperature, 66.24);
        assert.equal(forecast.weather.precipitation, 0);
        assert.equal(forecast.weather.precipitationType, undefined);
        assert.equal(forecast.weather.humidity, 0.69);
        assert.equal(forecast.weather.wind, 5.28);
        assert.equal(forecast.weather.gusts, 9.05);
        assert.equal(forecast.weather.direction, 340);
        assert.equal(forecast.weather.coverage, 0);
        assert.equal(forecast.weather.visibility, 7.578);
    });
});

describe('Tests for the DarkSkyForecast next methods', () => {
    const forecast = new darksky.DarkSkyForecast(data);
    it('should not return any day', () => {
        const result = forecast.nextRain();
        assert.equal(result, null)
    });
    it('should return the next rainy day', () => {
        const result = forecast.nextRain(0.01);
        assert.equal(result.weather.precipitation, 0.06);
    });
    it('should return the next snowy day', () => {
        const result = forecast.nextSnow(0.01);
        assert.equal(result, null);
    });
    it('should return the next day with precipitation', () => {
        const result = forecast.nextPrecipitation(0.01);
        assert.equal(result.weather.precipitation, 0.06);
    });
    it('should return the next humid day', () => {
        const result = forecast.nextHighHumidity(0.5);
        assert.equal(result.weather.humidity, 0.79);
    });
    it('should return the next low visibility day', () => {
        const result = forecast.nextLowVisibility(10);
        assert.equal(result.weather.visibility, 9.242);
    });
    it('should return the next day with bad weather', () => {
        const result = forecast.nextBadWeather();
        assert.notEqual(result.weather, null);
    });
    it('should return the next day with good weather', () => {
        const result = forecast.nextSunnyWeather();
        assert.equal(result.weather.coverage, 0.14);
    });
    it('should return the next windy day', () => {
        const result = forecast.nextWindyWeather(7);
        assert.equal(result.weather.wind, 11.71);
    });
});

describe('Tests for the DarkSkyForecast top methods', () => {
    const forecast = new darksky.DarkSkyForecast(data);
    it('should return hottest day', () => {
        const result = forecast.hottest();
        assert.equal(result.weather.temperatureHigh, 67.49);
    });
    it('should return coldest day', () => {
        const result = forecast.coldest();
        assert.equal(result.weather.temperatureLow, 47.55);
    });
    it('should return wettest day', () => {
        const result = forecast.wettest();
        assert.equal(result.weather.precipitation, 0.12);
    });
    it('should return driest day', () => {
        const result = forecast.driest();
        assert.equal(result.weather.precipitation, 0.01);
    });
    it('should return hardest day', () => {
        const result = forecast.hardest();
        assert.equal(result.weather.precipitation, 0.06);
    });
    it('should return lightest day', () => {
        const result = forecast.lightest();
        assert.equal(result.weather.precipitation, 0.01);
    });
    it('should return sunniest day', () => {
        const result = forecast.sunniest();
        assert.equal(result.weather.coverage, 0.01);
    });
    it('should return cloudiest day', () => {
        const result = forecast.cloudiest();
        assert.equal(result.weather.coverage, 0.49);
    });
    it('should return windiest day', () => {
        const result = forecast.windiest();
        assert.equal(result.weather.wind, 11.71);
    });
    it('should return calmest day', () => {
        const result = forecast.calmest();
        assert.equal(result.weather.wind, 4.09);
    });
    it('should return humidest day', () => {
        const result = forecast.humidest();
        assert.equal(result.weather.humidity, 0.96);
    });
    it('should return aridest day', () => {
        const result = forecast.aridest();
        assert.equal(result.weather.humidity, 0.68);
    });
});

describe('Tests for the DarkSkyForecast text and text forecast methods', () => {
    const forecast = new darksky.DarkSkyForecast(data);
    it('should return the current summary', () => {
        const result = forecast.getCurrentSummary();
        assert.equal(result, 'Clear');
    });
    it(`should return today's summary`, () => {
        const result = forecast.getTodaysSummary();
        assert.equal(result, 'No precipitation throughout the week.');
    });
    it('should return the current forecast', () => {
        const result = forecast.getCurrentForecast();
        assert.notEqual(result, null);
    });
    it(`should return today's forecast`, () => {
        const result = forecast.getTodaysForecast();
        assert.notEqual(result, null);
    });
    it('should return the current alert', () => {
        const result = forecast.getAlert();
        assert.equal(result, 'No weather alerts for this time period.');
    });
    it('should return all alerts', () => {
        const result = forecast.getAlerts();
        assert.equal(result, null);
    });
});
