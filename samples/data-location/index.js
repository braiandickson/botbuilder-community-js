require('dotenv').config();
const bing = require('../../libraries/botbuilder-data-location-bing/lib/index');
const usc = require('../../libraries/botbuilder-data-location-uscensus/lib/index');
const osm = require('../../libraries/botbuilder-data-location-osm/lib/index');

async function bingLookup() {
    const loc = new bing.BingLocation({ key: process.env.BING_API_KEY });
    let result;
    
    result = await loc.bySingleLineAddress('617 West Main St. Charlottesville, VA');
    console.log(result.matchedAddress);
    console.log(`${ result.coordinates.x }, ${ result.coordinates.y }`);

    result = await loc.byCoordinates(38.031445, -78.488906);
    console.log(result.matchedAddress);

    result = await loc.byAddress({
        addressLine: '617 West Main St.',
        countryRegion: 'United States',
        postalCode: '22903'
    });
    console.log(result.matchedAddress);
}

async function uscLookup() {
    let settings, loc, result;
    
    settings = {
        returntype: 'locations'
    };
    loc = new usc.USCensusLocation(settings);
    
    result = await loc.bySingleLineAddress('617 West Main St. Charlottesville, VA');
    console.log(result.matchedAddress);
    console.log(`${ result.coordinates.x }, ${ result.coordinates.y }`);

    result = await loc.byAddress({
        street: '617 West Main St.',
        city: 'Charlottesville',
        state: 'VA',
        zip: '22903'
    });
    console.log(result.matchedAddress);

    settings = {
        returntype: 'geographies',
        vintage: 'Current_Current'
    };
    loc = new usc.USCensusLocation(settings);
    result = await loc.byCoordinates(38.031445, -78.488906);
    console.log(result);
}

async function osmLookup() {
    const settings = {
        application: 'OSM Data Example',
        addressdetails: 1,
        extratags: 1,
        namedetails: 1,
        email: 'michael@szul.us',
        dedupe: 1
    };
    const loc = new osm.OpenStreetMap(settings);
    let result;
    
    result = await loc.bySingleLineAddress('617 West Main St. Charlottesville, VA');
    console.log(result.matchedAddress);
    console.log(`${ result.coordinates.x }, ${ result.coordinates.y }`);
    
    setTimeout(async () => {
        result = await loc.byCoordinates(38.031445, -78.488906);
        console.log(result.matchedAddress);
    }, 1000);
    
    setTimeout(async () => {
        result = await loc.byAddress({
            street: '617 West Main St.',
            zip: '22903'
        });
        console.log(result.matchedAddress);
    }, 1000);
}

async function init() {
    await bingLookup();
    await uscLookup();
    await osmLookup();
}

init();
