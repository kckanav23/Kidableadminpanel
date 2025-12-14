/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoalResponse } from '../models/GoalResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class GoalsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List goals
     * Path params:
     * - clientId (uuid, required)
     * Query params:
     * - status (optional: active|achieved|discontinued|on_hold)
     * Returns goals with progress.
     * @returns GoalResponse OK
     * @throws ApiError
     */
    public getGoals1({
        clientId,
        status,
    }: {
        clientId: string,
        status?: string,
    }): CancelablePromise<Array<GoalResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/client/{clientId}/goals',
            path: {
                'clientId': clientId,
            },
            query: {
                'status': status,
            },
        });
    }
}
