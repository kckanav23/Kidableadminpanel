/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to create an initial goal
 */
export type InitialGoalCreateRequest = {
    goalText: string;
    setBy?: string;
    therapy?: InitialGoalCreateRequest.therapy;
};
export namespace InitialGoalCreateRequest {
    export enum therapy {
        ABA = 'ABA',
        SPEECH = 'Speech',
        OT = 'OT',
    }
}

