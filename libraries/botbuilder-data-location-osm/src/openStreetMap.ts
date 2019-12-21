import { stringify } from 'qs';
import * as request from 'request-promise';
import { OSMSettings, SEARCHTYPE, SingleLineAddress, Address } from './schema';

/**
 * @module botbuildercommunity/data-location-osm
 */

export class OpenStreetMap {
    private settings: OSMSettings;
    public constructor(settings: OSMSettings) {
        this.settings = settings;
    }
    private async getLocationData(searchType: SEARCHTYPE, params: SingleLineAddress | Address): Promise<any> {
        const opts = {
            uri: `https://nominatim.openstreetmap.org/search?${stringify(params)}`,
            method: 'GET',
            resolveWithFullResponse: true
        };
        const res: request.RequestPromise = await request(opts);
        const data: any = JSON.parse(res.body as string);
        if(data != null) {
            return null;
        }
        return null;
    }
    public async byAddress(parts: Address): Promise<any> {
        return await this.getLocationData(SEARCHTYPE.ADDRESS, parts);
    }
    public async bySingleLineAddress(address: SingleLineAddress): Promise<any> {
        return await this.getLocationData(SEARCHTYPE.ADDRESS, address);
    }
}
