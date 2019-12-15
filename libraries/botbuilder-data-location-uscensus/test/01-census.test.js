const assert = require('assert');
const rewire = require("rewire");
const census = rewire("../lib/usCensus");

const data = require('./data.json');

const request = async function request(options) {
    return Promise.resolve({ body: JSON.stringify(data) });
}

const settings = {
    returntype: 'locations'
}

census.__set__("request", request);

describe('Tests for US Census data', () => {
    
    it('should create a US Census object', () => {
        const loc = new census.USCensusLocation(settings);
        assert.notEqual(loc, null);
    });
    it('should return location match by address', async () => {
        const loc = new census.USCensusLocation(settings);
        const result = await loc.byAddress({
                street: '4600 Silver Hill Rd',
                city: 'Suitland',
                state: 'MD',
                zip: '20746'
            });
        assert.equal(result.matchedAddress, '4600 Silver Hill Rd, SUITLAND, MD, 20746');
    });
    it('should return location match by one line address', async () => {
        const loc = new census.USCensusLocation(settings);
        const result = await loc.bySingleLineAddress('4600 Silver Hill Rd, SUITLAND, MD, 20746');
        assert.equal(result.matchedAddress, '4600 Silver Hill Rd, SUITLAND, MD, 20746');
    });
    it('should return location match by coordinates', async () => {
        const loc = new census.USCensusLocation(settings);
        const result = await loc.byCoordinates({
                x: -76.92691,
                y: 38.846542
            });
        assert.equal(result.matchedAddress, '4600 Silver Hill Rd, SUITLAND, MD, 20746');
    });

});
