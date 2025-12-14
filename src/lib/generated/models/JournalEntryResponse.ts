/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ParentSummary } from './ParentSummary';
export type JournalEntryResponse = {
    /**
     * Entry id
     */
    id?: string;
    /**
     * Client id
     */
    clientId?: string;
    /**
     * Parent id
     */
    parentId?: string;
    /**
     * Entry date
     */
    entryDate?: string;
    /**
     * Entry time
     */
    entryTime?: string;
    /**
     * Zone
     */
    zone?: JournalEntryResponse.zone;
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
    /**
     * Created at
     */
    createdAt?: string;
    /**
     * Updated at
     */
    updatedAt?: string;
    parent?: ParentSummary;
};
export namespace JournalEntryResponse {
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

