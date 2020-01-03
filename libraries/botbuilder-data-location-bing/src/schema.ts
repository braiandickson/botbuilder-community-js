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
