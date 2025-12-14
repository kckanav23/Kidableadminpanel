/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResourceResponse } from '../models/ResourceResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ResourcesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List resources
     * Returns client-specific resources plus global resources.
     * @returns ResourceResponse OK
     * @throws ApiError
     */
    public getResources({
        clientId,
    }: {
        clientId: string,
    }): CancelablePromise<Array<ResourceResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/client/{clientId}/resources',
            path: {
                'clientId': clientId,
            },
        });
    }
}
