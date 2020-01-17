require('dotenv').config();
const ds = require('../../libraries/botbuilder-data-weather-darksky/lib/index')

async function init() {
    const settings = { key: process.env.DARK_SKY_KEY  };
    const client = new ds.DarkSkyClient(settings);
    const forecast = await client.getForecast(38.3712378, -78.7322446);

    const rain = forecast.nextRain();
    console.log(rain);

    const bad = forecast.nextBadWeather();
    console.log(bad);

    const sunny = forecast.nextSunnyWeather();
    console.log(sunny);

    const cold = forecast.coldest();
    console.log(cold);

    const hourlyCold = forecast.coldest('hourly');
    console.log(hourlyCold);
}

init();
