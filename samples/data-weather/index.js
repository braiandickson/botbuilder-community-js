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

    const minutelyWettest = forecast.wettest('minutely');
    console.log(minutelyWettest);

    const currentSummary = forecast.getCurrentSummary();
    console.log(currentSummary);

    const todaysSummary = forecast.getTodaysSummary();
    console.log(todaysSummary);

    const currentForecast = forecast.getCurrentForecast();
    console.log(currentForecast);

    const todaysForecast = forecast.getTodaysForecast();
    console.log(todaysForecast);

    const alert = forecast.getAlert();
    console.log(alert);

    const alerts = forecast.getAlerts();
    console.log(alerts);

}

init();
