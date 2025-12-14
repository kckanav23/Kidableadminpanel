/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type JournalEntryRequest = {
    /**
     * Parent id
     */
    parentId: string;
    /**
     * Entry date (defaults to today if null)
     */
    entryDate?: string;
    /**
     * Entry time
     */
    entryTime?: string;
    /**
     * Zone
     */
    zone: JournalEntryRequest.zone;
    /**
     * Energy givers
     */
    energyGivers?: string;
    /**
     * Energy drainers
     */
    energyDrainers?: string;
    /**
     * Relaxing activity
     */
    relaxingActivity?: string;
    /**
     * Additional notes
     */
    additionalNotes?: string;
    /**
     * Tags
     */
    tags?: Array<string>;
};
export namespace JournalEntryRequest {
    /**
     * Zone
     */
    export enum zone {
        GREEN = 'green',
        YELLOW = 'yellow',
        ORANGE = 'orange',
        RED = 'red',
        BLUE = 'blue',
    }
}

