/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type HomeworkCreateRequest = {
    title: string;
    description?: string;
    purpose?: string;
    instructions?: Array<string>;
    frequency?: string;
    dataType: HomeworkCreateRequest.dataType;
    relatedGoalId?: string;
    therapy: HomeworkCreateRequest.therapy;
    status?: HomeworkCreateRequest.status;
    assignedDate?: string;
    dueDate?: string;
    active?: boolean;
};
export namespace HomeworkCreateRequest {
    export enum dataType {
        FREQUENCY = 'frequency',
        DURATION = 'duration',
        INTENSITY = 'intensity',
    }
    export enum therapy {
        ABA = 'ABA',
        SPEECH = 'Speech',
        OT = 'OT',
    }
    export enum status {
        WORKED = 'worked',
        NOT_WORKED = 'not_worked',
        YET_TO_TRY = 'yet_to_try',
        NOT_STARTED = 'not_started',
    }
}

