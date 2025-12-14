/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GoalCreateRequest = {
    title: string;
    description?: string;
    therapy: GoalCreateRequest.therapy;
    category?: string;
    targetCriteria?: string;
    baselineValue?: number;
    targetValue?: number;
    status?: GoalCreateRequest.status;
    startDate?: string;
    targetDate?: string;
    masteryCriteria?: string;
};
export namespace GoalCreateRequest {
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

