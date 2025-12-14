/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageResponseStrategyLibraryResponse } from '../models/PageResponseStrategyLibraryResponse';
import type { StrategyCreateRequest } from '../models/StrategyCreateRequest';
import type { StrategyLibraryResponse } from '../models/StrategyLibraryResponse';
import type { StrategyUpdateRequest } from '../models/StrategyUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminStrategyLibraryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List strategies in library
     * Browse all strategies. Filter by type, global flag, or search term.
     * @returns PageResponseStrategyLibraryResponse OK
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
    }): CancelablePromise<PageResponseStrategyLibraryResponse> {
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
     * @returns StrategyLibraryResponse Created
     * @throws ApiError
     */
    public create1({
        requestBody,
    }: {
        requestBody: StrategyCreateRequest,
    }): CancelablePromise<StrategyLibraryResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/strategies',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get strategy details
     * @returns StrategyLibraryResponse OK
     * @throws ApiError
     */
    public get1({
        strategyId,
    }: {
        strategyId: string,
    }): CancelablePromise<StrategyLibraryResponse> {
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
    public delete1({
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
     * @returns StrategyLibraryResponse OK
     * @throws ApiError
     */
    public update2({
        strategyId,
        requestBody,
    }: {
        strategyId: string,
        requestBody: StrategyUpdateRequest,
    }): CancelablePromise<StrategyLibraryResponse> {
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
}
