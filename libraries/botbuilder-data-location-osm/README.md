# Open Street Maps Data API

This is a convenience package for accessing the Open Stret Maps API for geocoding so that you can get structured address data to work with. All the location data packages in the Bot Builder Community Node.JS repository are meant to deliver similar data structures no matter which package you use. Most of these packages are just REST API wrappers.

> This is not explicitly a Bot Framework extension, but is a package used in other Bot Framework extensions. You can use it in other non-Bot Framework projects if you want.

## Installation

To install:

```powershell
npm install @botbuildercommunity/data-location-osm --save
```

## Usage

There are no keys, but you must be sure to include an application name and an email address in your settings object.

```javascript
const settings = {
    application: 'OSM Data Example',
    addressdetails: 1,
    extratags: 1,
    namedetails: 1,
    email: 'michael@szul.us',
    dedupe: 1
};
```

Next, import the package:

```javascript
const { OpenStreetMap } = require('@botbuildercommunity/data-location-osm');
```

Once imported, created a `OpenStreetMap` object:

```javascript
const loc = new OpenStreetMap(settings);
```

Now you can call one of three methods depending on your address structure:

> These are being called in a `setTimeout()` because Open Street Map has a limit of one call per second.

```javascript
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
```
