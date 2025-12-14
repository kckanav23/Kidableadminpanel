/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type StrategyResponse = {
    /**
     * Strategy id
     */
    id?: string;
    /**
     * Title
     */
    title?: string;
    /**
     * Description
     */
    description?: string;
    /**
     * Type
     */
    type?: StrategyResponse.type;
    /**
     * When to use
     */
    whenToUse?: string;
    /**
     * How to use
     */
    howToUse?: string;
    /**
     * Steps
     */
    steps?: Array<string>;
    /**
     * Examples
     */
    examples?: Array<string>;
    /**
     * Is global
     */
    isGlobal?: boolean;
    /**
     * Effectiveness rating
     */
    effectiveness?: string;
    /**
     * Custom notes for client
     */
    customNotes?: string;
    /**
     * Custom examples for client
     */
    customExamples?: Array<string>;
    /**
     * Assigned date
     */
    assignedDate?: string;
};
export namespace StrategyResponse {
    /**
     * Type
     */
    export enum type {
        ANTECEDENT = 'antecedent',
        REINFORCEMENT = 'reinforcement',
        REGULATION = 'regulation',
    }
}

