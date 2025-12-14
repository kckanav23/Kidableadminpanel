/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoalProgressCreateRequest } from '../models/GoalProgressCreateRequest';
import type { GoalProgressResponse } from '../models/GoalProgressResponse';
import type { GoalProgressUpdateRequest } from '../models/GoalProgressUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminGoalProgressService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Update goal progress (staff scoped)
     * @returns GoalProgressResponse OK
     * @throws ApiError
     */
    public updateProgress({
        goalId,
        progressId,
        requestBody,
    }: {
        goalId: string,
        progressId: string,
        requestBody: GoalProgressUpdateRequest,
    }): CancelablePromise<GoalProgressResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/admin/goals/{goalId}/progress/{progressId}',
            path: {
                'goalId': goalId,
                'progressId': progressId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete goal progress (staff scoped)
     * @returns any OK
     * @throws ApiError
     */
    public deleteProgress({
        goalId,
        progressId,
    }: {
        goalId: string,
        progressId: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/goals/{goalId}/progress/{progressId}',
            path: {
                'goalId': goalId,
                'progressId': progressId,
            },
        });
    }
    /**
     * Add goal progress (staff scoped)
     * @returns GoalProgressResponse OK
     * @throws ApiError
     */
    public addProgress({
        goalId,
        requestBody,
    }: {
        goalId: string,
        requestBody: GoalProgressCreateRequest,
    }): CancelablePromise<GoalProgressResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/goals/{goalId}/progress',
            path: {
                'goalId': goalId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
