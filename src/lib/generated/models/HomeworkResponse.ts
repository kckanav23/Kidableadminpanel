/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignedByUser } from './AssignedByUser';
import type { HomeworkCompletionResponse } from './HomeworkCompletionResponse';
import type { RelatedGoalResponse } from './RelatedGoalResponse';
export type HomeworkResponse = {
    /**
     * Homework id
     */
    id?: string;
    /**
     * Client id
     */
    clientId?: string;
    /**
     * Title
     */
    title: string;
    /**
     * Description
     */
    description?: string;
    /**
     * Purpose
     */
    purpose?: string;
    /**
     * Therapy type
     */
    therapy?: HomeworkResponse.therapy;
    /**
     * Frequency
     */
    frequency?: string;
    /**
     * Data collection type
     */
    dataType?: HomeworkResponse.dataType;
    /**
     * Assigned date
     */
    assignedDate?: string;
    /**
     * Due date
     */
    dueDate?: string;
    /**
     * Status
     */
    status?: HomeworkResponse.status;
    /**
     * Is active
     */
    isActive?: boolean;
    /**
     * Instructions
     */
    instructions?: Array<string>;
    /**
     * Related goal id
     */
    relatedGoalId?: string;
    assignedByUser?: AssignedByUser;
    /**
     * Completion log entries
     */
    homeworkCompletions?: Array<HomeworkCompletionResponse>;
    relatedGoal?: RelatedGoalResponse;
};
export namespace HomeworkResponse {
    /**
     * Therapy type
     */
    export enum therapy {
        ABA = 'ABA',
        SPEECH = 'Speech',
        OT = 'OT',
    }
    /**
     * Data collection type
     */
    export enum dataType {
        FREQUENCY = 'frequency',
        DURATION = 'duration',
        INTENSITY = 'intensity',
    }
    /**
     * Status
     */
    export enum status {
        WORKED = 'worked',
        NOT_WORKED = 'not_worked',
        YET_TO_TRY = 'yet_to_try',
        NOT_STARTED = 'not_started',
    }
}

