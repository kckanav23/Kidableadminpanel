/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientStrategyAssignRequest } from '../models/ClientStrategyAssignRequest';
import type { StrategiesByTypeResponse } from '../models/StrategiesByTypeResponse';
import type { StrategyResponse } from '../models/StrategyResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminStrategiesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Assign strategy to client (staff scoped)
     * @returns StrategyResponse OK
     * @throws ApiError
     */
    public assign1({
        clientId,
        requestBody,
    }: {
        clientId: string,
        requestBody: ClientStrategyAssignRequest,
    }): CancelablePromise<StrategyResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/clients/{clientId}/strategies/assign',
            path: {
                'clientId': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all strategies grouped (staff scoped)
     * @returns StrategiesByTypeResponse OK
     * @throws ApiError
     */
    public getAll1({
        clientId,
    }: {
        clientId: string,
    }): CancelablePromise<StrategiesByTypeResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/clients/{clientId}/strategies',
            path: {
                'clientId': clientId,
            },
        });
    }
    /**
     * Get strategies by type (staff scoped)
     * @returns StrategyResponse OK
     * @throws ApiError
     */
    public getByType1({
        clientId,
        type,
    }: {
        clientId: string,
        type: string,
    }): CancelablePromise<Array<StrategyResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/clients/{clientId}/strategies/{type}',
            path: {
                'clientId': clientId,
                'type': type,
            },
        });
    }
    /**
     * Unassign strategy from client (staff scoped)
     * @returns any OK
     * @throws ApiError
     */
    public unassign1({
        clientId,
        strategyId,
    }: {
        clientId: string,
        strategyId: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/clients/{clientId}/strategies/{strategyId}',
            path: {
                'clientId': clientId,
                'strategyId': strategyId,
            },
        });
    }
}
