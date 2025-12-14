/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Homework completion entry
 */
export type HomeworkCompletionResponse = {
    id?: string;
    completionDate?: string;
    frequencyCount?: number;
    durationMinutes?: number;
    status?: HomeworkCompletionResponse.status;
    notes?: string;
    loggedByParent?: string;
};
export namespace HomeworkCompletionResponse {
    export enum status {
        WORKED = 'worked',
        NOT_WORKED = 'not_worked',
        YET_TO_TRY = 'yet_to_try',
        NOT_STARTED = 'not_started',
    }
}

