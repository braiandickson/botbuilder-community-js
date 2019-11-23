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

describe('Tests for the DarkSkyForecast methods', () => {
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
});
