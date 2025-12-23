/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientTherapistResponse } from '../models/ClientTherapistResponse';
import type { TherapistAssignRequest } from '../models/TherapistAssignRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminClientTherapistsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List therapists assigned to a client
     * @returns ClientTherapistResponse OK
     * @throws ApiError
     */
    public list5({
        clientId,
    }: {
        clientId: string,
    }): CancelablePromise<Array<ClientTherapistResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/clients/{clientId}/therapists',
            path: {
                'clientId': clientId,
            },
        });
    }
    /**
     * Assign a therapist to a client
     * @returns ClientTherapistResponse OK
     * @throws ApiError
     */
    public assign({
        clientId,
        requestBody,
    }: {
        clientId: string,
        requestBody: TherapistAssignRequest,
    }): CancelablePromise<ClientTherapistResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/clients/{clientId}/therapists',
            path: {
                'clientId': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Remove a therapist from a client
     * @returns any OK
     * @throws ApiError
     */
    public unassign1({
        clientId,
        therapistId,
    }: {
        clientId: string,
        therapistId: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/clients/{clientId}/therapists/{therapistId}',
            path: {
                'clientId': clientId,
                'therapistId': therapistId,
            },
        });
    }
}
