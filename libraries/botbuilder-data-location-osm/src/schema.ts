/**
 * @module botbuildercommunity/data-location-osm
 */

export interface OSMSettings {
    addressdetails?: number;
    extratags?: number;
    namedetails?: number;
    locale?: string;
    limit?: number;
    email: string;
    dedupe?: number;
    debug?: number;
}

export enum FORMAT {
    HTML = 'html',
    XML = 'xml',
    JSON = 'json',
    JSONV2 = 'jsonv2',
    GEOJSON = 'geojson',
    GEOCODEJSON = 'geocodejson'
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

export interface Coordinates {
    x: number;
    y: number;
}

export interface AddressComponents {
    fromAddress?: number;
    toAddress?: number;
    preQualifier?: string;
    preDirection?: string;
    preType?: string;
    streetNumber?: string;
    streetName: string;
    suffixType?: string;
    suffixDirection?: string;
    suffixQualifier?: string;
    town?: string;
    city: string;
    county?: string;
    state: string;
    zip: string | number;
    country?: string;
}

export interface AddressMatch {
    matchedAddress: string;
    coordinates: Coordinates;
    addressComponents: AddressComponents;
    other?: any;
}
