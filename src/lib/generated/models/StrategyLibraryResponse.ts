/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Strategy library entry
 */
export type StrategyLibraryResponse = {
    /**
     * Strategy ID
     */
    id?: string;
    /**
     * Strategy title
     */
    title?: string;
    /**
     * Strategy description
     */
    description?: string;
    /**
     * Strategy type
     */
    type?: StrategyLibraryResponse.type;
    /**
     * When to use this strategy
     */
    whenToUse?: string;
    /**
     * How to use this strategy
     */
    howToUse?: string;
    /**
     * Implementation steps
     */
    steps?: Array<string>;
    /**
     * Usage examples
     */
    examples?: Array<string>;
    /**
     * Target zone for this strategy
     */
    targetZone?: StrategyLibraryResponse.targetZone;
    /**
     * Whether this is a global strategy
     */
    global?: boolean;
    /**
     * Creation timestamp
     */
    createdAt?: string;
    /**
     * Last update timestamp
     */
    updatedAt?: string;
};
export namespace StrategyLibraryResponse {
    /**
     * Strategy type
     */
    export enum type {
        ANTECEDENT = 'antecedent',
        REINFORCEMENT = 'reinforcement',
        REGULATION = 'regulation',
    }
    /**
     * Target zone for this strategy
     */
    export enum targetZone {
        GREEN = 'green',
        YELLOW = 'yellow',
        ORANGE = 'orange',
        RED = 'red',
        BLUE = 'blue',
    }
}

