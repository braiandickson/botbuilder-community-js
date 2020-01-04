import { stringify } from 'qs';
import * as request from 'request-promise';
import { BingSettings, Address, SingleLineAddress, SEARCHTYPE, FORMAT } from './schema';

/**
 * @module botbuildercommunity/data-location-bing
 */

export class BingLocation {
    private settings: BingSettings;
    public constructor(settings: BingSettings) {
        this.settings = settings;
    }
    private async getLocationData(searchType: SEARCHTYPE, params: any): Promise<any> {
        const p: any = { ...this.settings, ...{ o: FORMAT.JSON }, ...params};
        const url = (searchType === SEARCHTYPE.COORDINATES)
            ? `http://dev.virtualearth.net/REST/v1/Locations/${ p }`
            : `http://dev.virtualearth.net/REST/v1/Locations?${ stringify(p) }`;

        const opts = {
            uri: `${ url }`,
            method: 'GET',
            resolveWithFullResponse: true
        };
        const res: request.RequestPromise = await request(opts);
        const data: any = JSON.parse(res.body as string);
        return data;
    }
    public async byAddress(parts: Address): Promise<any> {
        return await this.getLocationData(SEARCHTYPE.ADDRESS, parts);
    }
    public async bySingleLineAddress(address: SingleLineAddress): Promise<any> {
        return await this.getLocationData(SEARCHTYPE.ONELINEADDRESS, address);
    }
    public async byCoordinates(coordinates: string): Promise<any> {
        return await this.getLocationData(SEARCHTYPE.COORDINATES, coordinates);
    }
}
