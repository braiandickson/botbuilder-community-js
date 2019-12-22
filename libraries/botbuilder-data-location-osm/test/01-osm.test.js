const assert = require('assert');
const rewire = require("rewire");
const osm = rewire("../lib/openStreetMap");

const data = require('./data.json');

const request = async function request(options) {
    return Promise.resolve({ body: JSON.stringify(data) });
}

const settings = {
    addressdetails: 1,
    extratags: 1,
    namedetails: 1,
    email: 'michael@szul.us',
    dedupe: 1
}

osm.__set__("request", request);

describe('Tests for OpenStreetMap data', () => {
    
    it('should create a OpenStreetMap object', () => {
        const loc = new osm.OpenStreetMap(settings);
        assert.notEqual(loc, null);
    });
    it('should return location match by address', async () => {
        const loc = new osm.OpenStreetMap(settings);
        const result = await loc.byAddress({
                street: '135 Pilkington Ave.',
                city: 'Birmingham',
                state: 'England',
                zip: 'B72 1LH'
            });
        assert.equal(result.matchedAddress, '135, Pilkington Avenue, Sutton Coldfield, Birmingham, West Midlands Combined Authority, West Midlands, England, B72 1LH, United Kingdom');
    });
    it('should return location match by one line address', async () => {
        const loc = new osm.OpenStreetMap(settings);
        const result = await loc.bySingleLineAddress('135 Pilkington Ave. Birmingham, England B72 1LH');
        assert.equal(result.matchedAddress, '135, Pilkington Avenue, Sutton Coldfield, Birmingham, West Midlands Combined Authority, West Midlands, England, B72 1LH, United Kingdom');
    });

});
