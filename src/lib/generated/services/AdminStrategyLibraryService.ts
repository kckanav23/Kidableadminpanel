/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageResponseStrategyResponse } from '../models/PageResponseStrategyResponse';
import type { StrategiesByTypeResponse } from '../models/StrategiesByTypeResponse';
import type { StrategyAssigntoClientRequest } from '../models/StrategyAssigntoClientRequest';
import type { StrategyCreateRequest } from '../models/StrategyCreateRequest';
import type { StrategyResponse } from '../models/StrategyResponse';
import type { StrategyUpdateRequest } from '../models/StrategyUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminStrategyLibraryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List strategies in library
     * Browse all strategies. Filter by type, global flag, or search term.
     * @returns PageResponseStrategyResponse OK
     * @throws ApiError
     */
    public list1({
        type,
        global,
        q,
        page,
        size = 20,
    }: {
        type?: string,
        global?: boolean,
        q?: string,
        page?: number,
        size?: number,
    }): CancelablePromise<PageResponseStrategyResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/strategies',
            query: {
                'type': type,
                'global': global,
                'q': q,
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * Create strategy
     * Add a new strategy to the library
     * @returns StrategyResponse Created
     * @throws ApiError
     */
    public create1({
        requestBody,
    }: {
        requestBody: StrategyCreateRequest,
    }): CancelablePromise<StrategyResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/strategies',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
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
        requestBody: StrategyAssigntoClientRequest,
    }): CancelablePromise<StrategyResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/clients/{clientId}/strategies/',
            path: {
                'clientId': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get strategy details
     * @returns StrategyResponse OK
     * @throws ApiError
     */
    public get1({
        strategyId,
    }: {
        strategyId: string,
    }): CancelablePromise<StrategyResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/strategies/{strategyId}',
            path: {
                'strategyId': strategyId,
            },
        });
    }
    /**
     * Delete strategy
     * Soft deletes the strategy from the library
     * @returns void
     * @throws ApiError
     */
    public delete({
        strategyId,
    }: {
        strategyId: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/strategies/{strategyId}',
            path: {
                'strategyId': strategyId,
            },
        });
    }
    /**
     * Update strategy
     * @returns StrategyResponse OK
     * @throws ApiError
     */
    public update1({
        strategyId,
        requestBody,
    }: {
        strategyId: string,
        requestBody: StrategyUpdateRequest,
    }): CancelablePromise<StrategyResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/admin/strategies/{strategyId}',
            path: {
                'strategyId': strategyId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get strategies by type (staff scoped)
     * @returns StrategyResponse OK
     * @throws ApiError
     */
    public getByType1({
        type,
        scope = 'all',
    }: {
        type: string,
        scope?: string,
    }): CancelablePromise<Array<StrategyResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/strategies/{type}',
            path: {
                'type': type,
            },
            query: {
                'scope': scope,
            },
        });
    }
    /**
     * Get all strategies grouped (staff scoped)
     * @returns StrategiesByTypeResponse OK
     * @throws ApiError
     */
    public getAll1({
        clientId,
        scope = 'all',
    }: {
        clientId: string,
        scope?: string,
    }): CancelablePromise<StrategiesByTypeResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/clients/{clientId}/strategies',
            path: {
                'clientId': clientId,
            },
            query: {
                'scope': scope,
            },
        });
    }
    /**
     * Unassign strategy from client (staff scoped)
     * @returns any OK
     * @throws ApiError
     */
    public unassign({
        clientId,
        strategyId,
    }: {
        clientId: string,
        strategyId: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/{clientId}/strategies/{strategyId}',
            path: {
                'clientId': clientId,
                'strategyId': strategyId,
            },
        });
    }
}
