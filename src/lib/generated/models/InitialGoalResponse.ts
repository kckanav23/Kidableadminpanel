/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Initial goal entry
 */
export type InitialGoalResponse = {
    id?: string;
    goalText?: string;
    setBy?: string;
    therapy?: InitialGoalResponse.therapy;
    createdAt?: string;
};
export namespace InitialGoalResponse {
    export enum therapy {
        ABA = 'ABA',
        SPEECH = 'Speech',
        OT = 'OT',
    }
}

