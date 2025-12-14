/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HomeworkCompletionRequest } from '../models/HomeworkCompletionRequest';
import type { HomeworkCompletionResponse } from '../models/HomeworkCompletionResponse';
import type { HomeworkCreateRequest } from '../models/HomeworkCreateRequest';
import type { HomeworkResponse } from '../models/HomeworkResponse';
import type { HomeworkUpdateRequest } from '../models/HomeworkUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminHomeworkService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List homework (staff scoped)
     * @returns HomeworkResponse OK
     * @throws ApiError
     */
    public getHomework({
        clientId,
        active = true,
    }: {
        clientId: string,
        active?: boolean,
    }): CancelablePromise<Array<HomeworkResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/clients/{clientId}/homework',
            path: {
                'clientId': clientId,
            },
            query: {
                'active': active,
            },
        });
    }
    /**
     * Create homework (staff scoped)
     * @returns HomeworkResponse OK
     * @throws ApiError
     */
    public createHomework({
        clientId,
        requestBody,
    }: {
        clientId: string,
        requestBody: HomeworkCreateRequest,
    }): CancelablePromise<HomeworkResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/clients/{clientId}/homework',
            path: {
                'clientId': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Log homework completion (staff scoped)
     * @returns HomeworkCompletionResponse OK
     * @throws ApiError
     */
    public logCompletion1({
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
            url: '/admin/clients/{clientId}/homework/{homeworkId}/complete',
            path: {
                'clientId': clientId,
                'homeworkId': homeworkId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete homework (soft, staff scoped)
     * @returns any OK
     * @throws ApiError
     */
    public deleteHomework({
        clientId,
        homeworkId,
    }: {
        clientId: string,
        homeworkId: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/clients/{clientId}/homework/{homeworkId}',
            path: {
                'clientId': clientId,
                'homeworkId': homeworkId,
            },
        });
    }
    /**
     * Update homework (staff scoped)
     * @returns HomeworkResponse OK
     * @throws ApiError
     */
    public updateHomework({
        clientId,
        homeworkId,
        requestBody,
    }: {
        clientId: string,
        homeworkId: string,
        requestBody: HomeworkUpdateRequest,
    }): CancelablePromise<HomeworkResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/admin/clients/{clientId}/homework/{homeworkId}',
            path: {
                'clientId': clientId,
                'homeworkId': homeworkId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
