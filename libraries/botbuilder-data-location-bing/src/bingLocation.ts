import { stringify } from 'qs';
import * as request from 'request-promise';
import { BingSettings, AddressMatch, Address, SingleLineAddress, SEARCHTYPE, FORMAT } from './schema';

/**
 * @module botbuildercommunity/data-location-bing
 */

export class BingLocation {
    private settings: BingSettings;
    public constructor(settings: BingSettings) {
        this.settings = settings;
    }
    private parseAddressMatch(data: any): AddressMatch {
        if(data != null && data.resourceSets !== undefined && data.resourceSets[0].resources !== undefined) {
            const resc: any = data.resourceSets[0].resources[0];
            const coord: number[] = resc.point.coordinates;
            console.warn('No street addresses incorporated.');
            return {
                matchedAddress: resc.name,
                coordinates: {
                    x: coord[0],
                    y: coord[1]
                },
                addressComponents: {
                    streetNumber: resc.address.addressLine,
                    streetName: null,
                    town: resc.address.neighborhood,
                    city: resc.address.locality,
                    county: resc.address.adminDistrict,
                    state: resc.address.adminDistrict2,
                    zip: resc.address.postalCode,
                    country: resc.address.countryRegion
                },
                other: {
                    bing: {
                        landmark: resc.address.landmark
                    }
                }
            };
        }
        return null;
    }
    private async getLocationData(searchType: SEARCHTYPE, params: any): Promise<any> {
        const p: any = { ...this.settings, ...{ o: FORMAT.JSON }, ...params};
        const url = (searchType === SEARCHTYPE.COORDINATES)
            ? `https://dev.virtualearth.net/REST/v1/Locations/${ p }`
            : `https://dev.virtualearth.net/REST/v1/Locations?${ stringify(p) }`;

        const opts = {
            uri: `${ url }`,
            method: 'GET',
            resolveWithFullResponse: true
        };
        const res: request.RequestPromise = await request(opts);
        const data: any = JSON.parse(res.body as string);
        if(data != null) {
            return this.parseAddressMatch(data);
        }
        return null;
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
