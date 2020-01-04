import { stringify } from 'qs';
import * as request from 'request-promise';
import { BingSettings } from './schema';


/**
 * @module botbuildercommunity/data-location-bing
 */

export class BingLocation {
    private settings: BingSettings;
    public constructor(settings: BingSettings) {
        this.settings = settings;
    }
    private async getLocationData(searchType: any, params: any): Promise<any> {
        const opts = {
            uri: `http://dev.virtualearth.net/REST/v1/Locations?${ stringify(params) }`,
            method: 'GET',
            resolveWithFullResponse: true
        };
        const res: request.RequestPromise = await request(opts);
        const data: any = JSON.parse(res.body as string);
        return data;
    }
}

/*
query={locationQuery}
&includeNeighborhood={includeNeighborhood}
&include={includeValue}
&maxResults={maxResults}
&key={BingMapsAPIKey}
*/

/*
countryRegion={countryRegion}
&adminDistrict={adminDistrict}
&locality={locality}
&postalCode={postalCode}
&addressLine={addressLine}
&userLocation={userLocation}
&userIp={userIp}
&usermapView={usermapView}
&includeNeighborhood={includeNeighborhood}
&maxResults={maxResults}&key={BingMapsKey}
*/
