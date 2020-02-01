require('dotenv').config();
const bing = require('../../libraries/botbuilder-data-location-bing/lib/index')

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

async function init() {
    await bingLookup();
}

init();
