# US Census Data API

This is a convenience package for accessing the US Census for geocoding so that you can get structured address data to work with. All the location data packages in the Bot Builder Community Node.JS repository are meant to deliver similar data structures no matter which package you use. Most of these packages are just REST API wrappers.

> This is not explicitly a Bot Framework extension, but is a package used in other Bot Framework extensions. You can use it in other non-Bot Framework projects if you want.

## Installation

To install:

```powershell
npm install @botbuildercommunity/data-location-uscensus --save
```

## Usage

Next, import the package:

```javascript
const { USCensusLocation } = require('@botbuildercommunity/data-location-uscensus');
```

Once imported, created a `USCensusLocation` object:

```javascript
const loc = new USCensusLocation({ returntype: locations });
```

Now you can call one of two methods depending on your address structure:

```javascript
    let result;
    
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
```

You can also get address information by coordinates, if you change the settings for the location object:

```javascript
    const settings = {
        returntype: 'geographies',
        vintage: 'Current_Current'
    };
    const loc = new usc.USCensusLocation(settings);
    const result = await loc.byCoordinates(38.031445, -78.488906);
    console.log(result);
```
