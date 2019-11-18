const assert = require('assert');
const rewire = require("rewire");
const darksky = rewire("../lib/darksky");

const data = require('./data.json');

const settings = {
    key: 'abcdefghijklmnopqrstuvwxyz'
};

const client = function createTwitterClient(settings) {
    return {
        post: async function (endpoint, message, callback) {
            return msg;
        }
    };
};

const getDarkSkyForecast = async function(latitude, longitude, settings) {
    return Promise.resolve(data);
}

darksky.__set__("getDarkSkyForecast", getDarkSkyForecast);

describe('Tests DarkSkyClient', () => {
    it('should create a client', () => {
        const client = new darksky.DarkSkyClient(settings);
        assert.notEqual(client, null);
    });
});
