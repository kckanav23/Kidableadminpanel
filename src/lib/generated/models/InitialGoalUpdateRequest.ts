/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to update an initial goal
 */
export type InitialGoalUpdateRequest = {
    goalText?: string;
    setBy?: string;
    therapy?: InitialGoalUpdateRequest.therapy;
};
export namespace InitialGoalUpdateRequest {
    export enum therapy {
        ABA = 'ABA',
        SPEECH = 'Speech',
        OT = 'OT',
    }
}

