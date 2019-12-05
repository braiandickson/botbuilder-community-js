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

export interface IUSCensusSettings {
    returntype: RETURNTYPE;
    searchtype: SEARCHTYPE;
    benchmark: number | string;
    vintage?: number | string;
    address?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    x?: number;
    y?: number;
    format?: FORMAT;
    layers?: any;
}
