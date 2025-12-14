/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HomeworkCompletionRequest } from '../models/HomeworkCompletionRequest';
import type { HomeworkCompletionResponse } from '../models/HomeworkCompletionResponse';
import type { HomeworkResponse } from '../models/HomeworkResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class HomeworkService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Log homework completion
     * Append a completion entry for a homework assignment.
     * @returns HomeworkCompletionResponse OK
     * @throws ApiError
     */
    public logCompletion({
        clientId,
        homeworkId,
        requestBody,
    }: {
        clientId: string,
        homeworkId: string,
        requestBody: HomeworkCompletionRequest,
    }): CancelablePromise<HomeworkCompletionResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/client/{clientId}/homework/{homeworkId}/complete',
            path: {
                'clientId': clientId,
                'homeworkId': homeworkId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List homework
     * Fetch homework assignments for a client; filter active by default.
     * @returns HomeworkResponse OK
     * @throws ApiError
     */
    public getHomework1({
        clientId,
        active = true,
    }: {
        clientId: string,
        active?: boolean,
    }): CancelablePromise<Array<HomeworkResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/client/{clientId}/homework',
            path: {
                'clientId': clientId,
            },
            query: {
                'active': active,
            },
        });
    }
}
