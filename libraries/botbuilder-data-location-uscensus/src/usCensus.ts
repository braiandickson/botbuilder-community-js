import { stringify } from 'qs';
import { IUSCensusSettings, FORMAT, SEARCHTYPE, RETURNTYPE } from './schema';

/**
 * @module botbuildercommunity/data-location-uscensus
 */

export class USCensusLocation {
    private readonly url: string;
    private readonly settings: IUSCensusSettings;
    private readonly searchType: SEARCHTYPE = SEARCHTYPE.ONELINEADDRESS;
    private readonly returnType: RETURNTYPE = RETURNTYPE.LOCATIONS;
    private readonly paramsString: string;
    public constructor(settings: IUSCensusSettings) {
        this.settings = { ...{ benchmark: 'Public_AR_Current', format: FORMAT.JSON }, ...settings};
        if(this.settings.searchtype) {
            this.searchType = this.settings.searchtype;
            delete this.settings.searchtype;
        }
        if(this.settings.returntype) {
            this.returnType = this.settings.returntype;
            delete this.settings.returntype;
        }
        this.paramsString = stringify(this.settings);
        this.url = `https://geocoding.geo.census.gov/geocoder/${this.returnType}/${this.searchType}?${this.paramsString}`
    }
}
