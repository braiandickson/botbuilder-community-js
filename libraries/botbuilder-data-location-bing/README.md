# Bing Maps Data API

This is a convenience package for accessing the Bing Maps API for geocoding so that you can get structured address data to work with. All the location data packages in the Bot Builder Community Node.JS repository are meant to deliver similar data structures no matter which package you use. Most of these packages are just REST API wrappers.

> This is not explicitly a Bot Framework extension, but is a package used in other Bot Framework extensions. You can use it in other non-Bot Framework projects if you want.

## Installation

To install:

```powershell
npm install @botbuildercommunity/data-location-bing --save
```

## Usage

You will need to have a Bing Maps API key in your environment variables. Add the following to your `.env` file:

    BING_API_KEY=<YOUR_BING_API_KEY>

Next, import the package:

```javascript
const { BingLocation } = require('@botbuildercommunity/data-location-bing');
```

Once imported, created a `BingLocation` object:

```javascript
const loc = new BingLocation({ key: process.env.BING_API_KEY });
```

Now you can call one of three methods depending on your address structure:

```javascript
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
```
