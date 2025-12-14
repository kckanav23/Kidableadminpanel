/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoalCreateRequest } from '../models/GoalCreateRequest';
import type { GoalResponse } from '../models/GoalResponse';
import type { GoalUpdateRequest } from '../models/GoalUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminGoalsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List goals (staff scoped)
     * @returns GoalResponse OK
     * @throws ApiError
     */
    public getGoals({
        clientId,
        status,
    }: {
        clientId: string,
        status?: string,
    }): CancelablePromise<Array<GoalResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/clients/{clientId}/goals',
            path: {
                'clientId': clientId,
            },
            query: {
                'status': status,
            },
        });
    }
    /**
     * Create goal (staff scoped)
     * @returns GoalResponse OK
     * @throws ApiError
     */
    public createGoal({
        clientId,
        requestBody,
    }: {
        clientId: string,
        requestBody: GoalCreateRequest,
    }): CancelablePromise<GoalResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/clients/{clientId}/goals',
            path: {
                'clientId': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete goal (soft, staff scoped)
     * @returns any OK
     * @throws ApiError
     */
    public deleteGoal({
        clientId,
        goalId,
    }: {
        clientId: string,
        goalId: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/clients/{clientId}/goals/{goalId}',
            path: {
                'clientId': clientId,
                'goalId': goalId,
            },
        });
    }
    /**
     * Update goal (staff scoped)
     * @returns GoalResponse OK
     * @throws ApiError
     */
    public updateGoal({
        clientId,
        goalId,
        requestBody,
    }: {
        clientId: string,
        goalId: string,
        requestBody: GoalUpdateRequest,
    }): CancelablePromise<GoalResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/admin/clients/{clientId}/goals/{goalId}',
            path: {
                'clientId': clientId,
                'goalId': goalId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
