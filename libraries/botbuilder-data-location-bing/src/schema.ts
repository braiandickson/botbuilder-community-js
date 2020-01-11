/**
 * @module botbuildercommunity/data-location-bing
 */

type inclnb = 0 | 1;

export interface BingSettings {
    key: string;
    includeNeighborhood?: inclnb;
    include?: string;
    maxResults?: number;
    o?: FORMAT
}

export enum FORMAT {
    XML = 'xml',
    JSON = 'json'
}

export enum SEARCHTYPE {
    ONELINEADDRESS = 0,
    ADDRESS = 1,
    COORDINATES = 2
}

export interface SingleLineAddress {
    query: string;
}

export interface Address {
    countryRegion?: string;
    adminDistrict?: string;
    adminDistrict2?: string;
    locality?: string;
    postalCode?: string;
    addressLine?: string;
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
