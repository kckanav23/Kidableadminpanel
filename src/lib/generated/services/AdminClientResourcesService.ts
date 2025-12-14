/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientResourceAssignRequest } from '../models/ClientResourceAssignRequest';
import type { ResourceResponse } from '../models/ResourceResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminClientResourcesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Assign resource to client (staff scoped)
     * @returns ResourceResponse OK
     * @throws ApiError
     */
    public assign2({
        clientId,
        requestBody,
    }: {
        clientId: string,
        requestBody: ClientResourceAssignRequest,
    }): CancelablePromise<ResourceResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/clients/{clientId}/resources/assign',
            path: {
                'clientId': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List resources for client (staff scoped)
     * @returns ResourceResponse OK
     * @throws ApiError
     */
    public getResources1({
        clientId,
    }: {
        clientId: string,
    }): CancelablePromise<Array<ResourceResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/clients/{clientId}/resources',
            path: {
                'clientId': clientId,
            },
        });
    }
    /**
     * Unassign resource from client (staff scoped)
     * @returns any OK
     * @throws ApiError
     */
    public unassign2({
        clientId,
        resourceId,
    }: {
        clientId: string,
        resourceId: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/clients/{clientId}/resources/{resourceId}',
            path: {
                'clientId': clientId,
                'resourceId': resourceId,
            },
        });
    }
}
