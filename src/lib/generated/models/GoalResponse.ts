/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoalProgressPoint } from './GoalProgressPoint';
import type { GoalProgressResponse } from './GoalProgressResponse';
export type GoalResponse = {
    /**
     * Goal id
     */
    id?: string;
    /**
     * Client id
     */
    clientId?: string;
    /**
     * Goal title
     */
    title: string;
    /**
     * Goal description
     */
    description?: string;
    /**
     * Therapy type
     */
    therapy: GoalResponse.therapy;
    /**
     * Target criteria
     */
    targetCriteria?: string;
    /**
     * Baseline value
     */
    baselineValue?: string;
    /**
     * Target value
     */
    targetValue?: string;
    /**
     * Status
     */
    status: GoalResponse.status;
    /**
     * Start date
     */
    startDate?: string;
    /**
     * Target date
     */
    targetDate?: string;
    /**
     * Achieved date
     */
    achievedDate?: string;
    /**
     * Created timestamp
     */
    createdAt?: string;
    /**
     * Progress entries
     */
    goalProgress?: Array<GoalProgressResponse>;
    /**
     * Progress chart points
     */
    progressData?: Array<GoalProgressPoint>;
};
export namespace GoalResponse {
    /**
     * Therapy type
     */
    export enum therapy {
        ABA = 'ABA',
        SPEECH = 'Speech',
        OT = 'OT',
    }
    /**
     * Status
     */
    export enum status {
        ACTIVE = 'active',
        ACHIEVED = 'achieved',
        DISCONTINUED = 'discontinued',
        ON_HOLD = 'on_hold',
    }
}

