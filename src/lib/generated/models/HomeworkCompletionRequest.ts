/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type HomeworkCompletionRequest = {
    /**
     * Completion date (defaults to today if null)
     */
    completionDate?: string;
    /**
     * Frequency count (for frequency type)
     */
    frequencyCount?: number;
    /**
     * Duration minutes (for duration type)
     */
    durationMinutes?: number;
    /**
     * Status
     */
    status: HomeworkCompletionRequest.status;
    /**
     * Notes
     */
    notes?: string;
    /**
     * Parent id string (optional)
     */
    loggedByParent?: string;
};
export namespace HomeworkCompletionRequest {
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

