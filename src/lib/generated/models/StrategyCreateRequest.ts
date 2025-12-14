/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to create a strategy in the library
 */
export type StrategyCreateRequest = {
    /**
     * Strategy title
     */
    title: string;
    /**
     * Strategy description
     */
    description?: string;
    /**
     * Strategy type
     */
    type: StrategyCreateRequest.type;
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
    targetZone?: StrategyCreateRequest.targetZone;
    /**
     * Whether this is a global strategy (defaults to true)
     */
    global?: boolean;
};
export namespace StrategyCreateRequest {
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

