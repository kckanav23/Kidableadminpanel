/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResourceLibraryResponse } from '../models/ResourceLibraryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ResourcesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List resources
     * Returns client-specific resources plus global resources.
     * @returns ResourceLibraryResponse OK
     * @throws ApiError
     */
    public getResources({
        clientId,
        scope = 'all',
    }: {
        clientId: string,
        scope?: string,
    }): CancelablePromise<Array<ResourceLibraryResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/client/{clientId}/resources',
            path: {
                'clientId': clientId,
            },
            query: {
                'scope': scope,
            },
        });
    }
}
