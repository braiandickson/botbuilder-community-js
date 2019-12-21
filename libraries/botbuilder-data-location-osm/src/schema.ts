/**
 * @module botbuildercommunity/data-location-osm
 */

 export interface OSMSettings {

 }

 export enum SEARCHTYPE {
    ONELINEADDRESS = 0,
    ADDRESS = 1
}

export interface SingleLineAddress {
    q: string;
}

export interface Address {
    street?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    postalcode?: string;
}
