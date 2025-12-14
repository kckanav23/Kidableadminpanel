/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Today's mood summary
 */
export type TodayMood = {
    mood?: string;
    emoji?: string;
    zone?: TodayMood.zone;
    energyLevel?: string;
};
export namespace TodayMood {
    export enum zone {
        GREEN = 'green',
        YELLOW = 'yellow',
        ORANGE = 'orange',
        RED = 'red',
        BLUE = 'blue',
    }
}

