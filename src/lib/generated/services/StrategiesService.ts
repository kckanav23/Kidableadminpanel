/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StrategiesByTypeResponse } from '../models/StrategiesByTypeResponse';
import type { StrategyResponse } from '../models/StrategyResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class StrategiesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get all strategies grouped by type
     * Path params: clientId (uuid). Returns active strategies grouped into antecedent, reinforcement, regulation.
     * @returns StrategiesByTypeResponse OK
     * @throws ApiError
     */
    public getAll({
        clientId,
        scope = 'all',
    }: {
        clientId: string,
        scope?: string,
    }): CancelablePromise<StrategiesByTypeResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/client/{clientId}/strategies',
            path: {
                'clientId': clientId,
            },
            query: {
                'scope': scope,
            },
        });
    }
    /**
     * Get strategies by type
     * Path params: clientId (uuid), type (antecedent|reinforcement|regulation). Returns active strategies of that type.
     * @returns StrategyResponse OK
     * @throws ApiError
     */
    public getByType({
        clientId,
        type,
        scope = 'all',
    }: {
        clientId: string,
        type: string,
        scope?: string,
    }): CancelablePromise<Array<StrategyResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/client/{clientId}/strategies/{type}',
            path: {
                'clientId': clientId,
                'type': type,
            },
            query: {
                'scope': scope,
            },
        });
    }
}
