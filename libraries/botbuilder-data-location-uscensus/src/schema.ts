/**
 * @module botbuildercommunity/data-location-uscensus
 */

export enum RETURNTYPE {
    LOCATIONS = 'locations',
    GEOGRAPHIES = 'geographies'
}

export enum SEARCHTYPE {
    ONELINEADDRESS = 'onelineaddress',
    ADDRESS = 'address',
    COORDINATES = 'coordinates'
}

export enum FORMAT {
    JSON = 'json',
    HTML = 'html'
}

export interface SingleLineAddress {
    address: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface Coordinates {
    x: number;
    y: number;
}

export interface USCensusSettings {
    returntype: RETURNTYPE;
    benchmark: number | string;
    vintage?: number | string;
    format?: FORMAT;
    layers?: any;
}

export interface TigerLine {
    tigerLineId: number;
    side: string;
}

export interface AddressComponents {
    fromAddress: number;
    toAddress: number;
    preQualifier?: string;
    preDirection?: string;
    preType?: string;
    streetName: string;
    suffixType: string;
    suffixDirection?: string;
    suffixQualifier?: string;
    city: string;
    state: string;
    zip: number;
}

export interface AddressMatch {
    matchedAddress: string;
    coordinates: Coordinates;
    tigerLine: TigerLine;
    addressComponents: AddressComponents;
}
