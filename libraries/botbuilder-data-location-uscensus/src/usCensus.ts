import { stringify } from 'qs';
import * as request from 'request-promise';
import { USCensusSettings, SingleLineAddress, Address, Coordinates, AddressMatch, FORMAT, SEARCHTYPE, RETURNTYPE } from './schema';

/**
 * @module botbuildercommunity/data-location-uscensus
 */

export class USCensusLocation {
    private settings: USCensusSettings;
    private returnType: RETURNTYPE = RETURNTYPE.LOCATIONS;
    public constructor(settings: USCensusSettings) {
        this.parseSettings(settings);
    }
    private parseSettings(settings: USCensusSettings): void {
        this.settings = { ...{ benchmark: 'Public_AR_Current', format: FORMAT.JSON }, ...settings};
        if(this.settings.returntype) {
            this.returnType = this.settings.returntype;
            delete this.settings.returntype;
        }
    }
    private async getLocationData(searchType: SEARCHTYPE, params: SingleLineAddress | Address | Coordinates): Promise<AddressMatch> {
        const opts = {
            uri: `https://geocoding.geo.census.gov/geocoder/${ this.returnType }/${ searchType }?${ stringify({ ...this.settings, ...params }) }`,
            method: 'GET',
            resolveWithFullResponse: true
        };
        const res: request.RequestPromise = await request(opts);
        const data: any = JSON.parse(res.body as string);
        if(data != null && data.result != null) {
            if(data.result.addressMatches != null) {
                return data.result.addressMatches[0];
            }
            if(data.result.geographies != null) {
                return data.result.geographies;
            }
        }
        return null;
    }
    public async byAddress(parts: Address): Promise<AddressMatch> {
        return await this.getLocationData(SEARCHTYPE.ADDRESS, parts);
    }
    public async bySingleLineAddress(address: string): Promise<AddressMatch> {
        return await this.getLocationData(SEARCHTYPE.ONELINEADDRESS, { address: address });
    }
    public async byCoordinates(x: number, y: number): Promise<AddressMatch> {
        return await this.getLocationData(SEARCHTYPE.COORDINATES, { x: x, y: y });
    }
}
