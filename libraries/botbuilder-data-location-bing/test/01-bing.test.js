const assert = require('assert');
const rewire = require("rewire");
const bing = rewire("../lib/bingLocation");

const data = require('./data.json');

const request = async function request(options) {
    return Promise.resolve({ body: JSON.stringify(data) });
}

const settings = {
    key: ''
}

bing.__set__("request", request);

describe('Tests for Bing Location data', () => {
    
    it('should create a BingLocation object', () => {
        const loc = new bing.BingLocation(settings);
        assert.notEqual(loc, null);
    });
    it('should return location match by address', async () => {
        const loc = new bing.BingLocation(settings);
        const result = await loc.byAddress({
                addressLine: '',
                adminDistrict: '',
                countryRegion: '',
                postalCode: ''
            });
        assert.equal(result.matchedAddress, '');
    });
    it('should return location match by one line address', async () => {
        const loc = new bing.BingLocation(settings);
        const result = await loc.bySingleLineAddress('');
        assert.equal(result.matchedAddress, '');
    });
    it('should return location match by coordinates', async () => {
        const loc = new bing.BingLocation(settings);
        const result = await loc.byCoordinates('51.509521484375,-0.0763700008392334');
        assert.equal(result.matchedAddress, '');
    });

});
