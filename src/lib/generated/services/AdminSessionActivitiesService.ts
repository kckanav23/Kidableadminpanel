/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SessionActivityCreateRequest } from '../models/SessionActivityCreateRequest';
import type { SessionActivityResponse } from '../models/SessionActivityResponse';
import type { SessionActivityUpdateRequest } from '../models/SessionActivityUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminSessionActivitiesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Update session activity (staff scoped)
     * @returns SessionActivityResponse OK
     * @throws ApiError
     */
    public updateActivity({
        sessionId,
        activityId,
        requestBody,
    }: {
        sessionId: string,
        activityId: string,
        requestBody: SessionActivityUpdateRequest,
    }): CancelablePromise<SessionActivityResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/admin/sessions/{sessionId}/activities/{activityId}',
            path: {
                'sessionId': sessionId,
                'activityId': activityId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete session activity (staff scoped)
     * @returns any OK
     * @throws ApiError
     */
    public deleteActivity({
        sessionId,
        activityId,
    }: {
        sessionId: string,
        activityId: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/sessions/{sessionId}/activities/{activityId}',
            path: {
                'sessionId': sessionId,
                'activityId': activityId,
            },
        });
    }
    /**
     * Add session activity (staff scoped)
     * @returns SessionActivityResponse OK
     * @throws ApiError
     */
    public addActivity({
        sessionId,
        requestBody,
    }: {
        sessionId: string,
        requestBody: SessionActivityCreateRequest,
    }): CancelablePromise<SessionActivityResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/sessions/{sessionId}/activities',
            path: {
                'sessionId': sessionId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
