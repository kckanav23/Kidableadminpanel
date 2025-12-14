/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GoalUpdateRequest = {
    title?: string;
    description?: string;
    therapy?: GoalUpdateRequest.therapy;
    targetCriteria?: string;
    baselineValue?: number;
    targetValue?: number;
    status?: GoalUpdateRequest.status;
    startDate?: string;
    targetDate?: string;
    achievedDate?: string;
};
export namespace GoalUpdateRequest {
    export enum therapy {
        ABA = 'ABA',
        SPEECH = 'Speech',
        OT = 'OT',
    }
    export enum status {
        ACTIVE = 'active',
        ACHIEVED = 'achieved',
        DISCONTINUED = 'discontinued',
        ON_HOLD = 'on_hold',
    }
}

