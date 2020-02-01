import { stringify } from 'qs';
import * as request from 'request-promise';
import { OSMSettings, SEARCHTYPE, SingleLineAddress, Address, FORMAT, AddressMatch } from './schema';

/**
 * @module botbuildercommunity/data-location-osm
 */

export class OpenStreetMap {
    private settings: OSMSettings;
    public constructor(settings: OSMSettings) {
        this.settings = { ...{ addressdetails: 0, extratags: 0, namedetails: 0, limit: 10, dedupe: 0, debug: 0, format: FORMAT.JSON }, ...settings};
        if(this.settings.locale !== undefined) {
            this.settings['accept-language'] = this.settings.locale;
            delete this.settings.locale;
        }
    }
    private parseAddressMatch(data: any): AddressMatch {
        return {
            matchedAddress: data.display_name,
            coordinates: {
                x: data.lat,
                y: data.lon
            },
            addressComponents: {
                streetNumber: data.address.house_number,
                streetName: data.address.road,
                town: data.address.town,
                city: data.address.city,
                county: data.address.county,
                state: data.address.state,
                zip: data.address.postcode,
                country: data.address.country
            },
            other: {
                osm: {
                    place_id: data.place_id,
                    license: data.license,
                    osm_type: data.osm_type,
                    osm_id: data.osm_id,
                    boundingbox: data.boundingbox,
                    class: data.class,
                    type: data.type,
                    importance: data.importance
                },
                extratags: data.extratags,
                namedetails: data.namedetails
            }
        };
    }
    private async getLocationData(searchType: SEARCHTYPE, params: SingleLineAddress | Address): Promise<AddressMatch> {
        const opts = {
            uri: `https://nominatim.openstreetmap.org/search?${ stringify(params) }`,
            method: 'GET',
            resolveWithFullResponse: true,
            headers: {
                'User-Agent': `${ this.settings.application } Request-Promise OSM Bot Builder Community Data Package`
            }
        };
        const res: request.RequestPromise = await request(opts);
        const data: any = JSON.parse(res.body as string);
        if(data != null && data.length > 0) {
            return this.parseAddressMatch(data[0]);
        }
        return null;
    }
    public async byAddress(parts: Address): Promise<AddressMatch> {
        return await this.getLocationData(SEARCHTYPE.ADDRESS, parts);
    }
    public async bySingleLineAddress(address: string): Promise<AddressMatch> {
        return await this.getLocationData(SEARCHTYPE.ONELINEADDRESS, { q: address });
    }
}
