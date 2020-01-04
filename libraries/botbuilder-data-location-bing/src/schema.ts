/**
 * @module botbuildercommunity/data-location-bing
 */

type inclnb = 0 | 1;

export interface BingSettings {
    key: string;
    includeNeighborhood?: inclnb;
    include?: string;
    maxResults?: number;
}

export enum FORMAT {
    XML = 'xml',
    JSON = 'json'
}

export enum SEARCHTYPE {
    ONELINEADDRESS = 0,
    ADDRESS = 1
}

export interface SingleLineAddress {
    query: string;
}

export interface Address {
    countryRegion?: string;
    adminDistrict?: string;
    locality?: string;
    postalCode?: string;
    addressLine?: string;
}

export interface Coordinates {
    x: number;
    y: number;
}
