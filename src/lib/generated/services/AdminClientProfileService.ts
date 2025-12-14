/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommunicationCreateRequest } from '../models/CommunicationCreateRequest';
import type { CommunicationResponse } from '../models/CommunicationResponse';
import type { CommunicationUpdateRequest } from '../models/CommunicationUpdateRequest';
import type { InitialGoalCreateRequest } from '../models/InitialGoalCreateRequest';
import type { InitialGoalResponse } from '../models/InitialGoalResponse';
import type { InitialGoalUpdateRequest } from '../models/InitialGoalUpdateRequest';
import type { SupportNetworkCreateRequest } from '../models/SupportNetworkCreateRequest';
import type { SupportNetworkResponse } from '../models/SupportNetworkResponse';
import type { SupportNetworkUpdateRequest } from '../models/SupportNetworkUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminClientProfileService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Update support network entry
     * @returns SupportNetworkResponse OK
     * @throws ApiError
     */
    public updateSupportNetwork({
        clientId,
        entryId,
        requestBody,
    }: {
        clientId: string,
        entryId: string,
        requestBody: SupportNetworkUpdateRequest,
    }): CancelablePromise<SupportNetworkResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/admin/clients/{clientId}/support-network/{entryId}',
            path: {
                'clientId': clientId,
                'entryId': entryId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete support network entry
     * @returns void
     * @throws ApiError
     */
    public deleteSupportNetwork({
        clientId,
        entryId,
    }: {
        clientId: string,
        entryId: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/clients/{clientId}/support-network/{entryId}',
            path: {
                'clientId': clientId,
                'entryId': entryId,
            },
        });
    }
    /**
     * Update initial goal
     * @returns InitialGoalResponse OK
     * @throws ApiError
     */
    public updateInitialGoal({
        clientId,
        goalId,
        requestBody,
    }: {
        clientId: string,
        goalId: string,
        requestBody: InitialGoalUpdateRequest,
    }): CancelablePromise<InitialGoalResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/admin/clients/{clientId}/initial-goals/{goalId}',
            path: {
                'clientId': clientId,
                'goalId': goalId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete initial goal
     * @returns void
     * @throws ApiError
     */
    public deleteInitialGoal({
        clientId,
        goalId,
    }: {
        clientId: string,
        goalId: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/clients/{clientId}/initial-goals/{goalId}',
            path: {
                'clientId': clientId,
                'goalId': goalId,
            },
        });
    }
    /**
     * Update communication style
     * @returns CommunicationResponse OK
     * @throws ApiError
     */
    public updateCommunication({
        clientId,
        commId,
        requestBody,
    }: {
        clientId: string,
        commId: string,
        requestBody: CommunicationUpdateRequest,
    }): CancelablePromise<CommunicationResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/admin/clients/{clientId}/communication/{commId}',
            path: {
                'clientId': clientId,
                'commId': commId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete communication style
     * @returns void
     * @throws ApiError
     */
    public deleteCommunication({
        clientId,
        commId,
    }: {
        clientId: string,
        commId: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/clients/{clientId}/communication/{commId}',
            path: {
                'clientId': clientId,
                'commId': commId,
            },
        });
    }
    /**
     * Add support network entry
     * @returns SupportNetworkResponse Created
     * @throws ApiError
     */
    public createSupportNetwork({
        clientId,
        requestBody,
    }: {
        clientId: string,
        requestBody: SupportNetworkCreateRequest,
    }): CancelablePromise<SupportNetworkResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/clients/{clientId}/support-network',
            path: {
                'clientId': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Add initial goal
     * @returns InitialGoalResponse Created
     * @throws ApiError
     */
    public createInitialGoal({
        clientId,
        requestBody,
    }: {
        clientId: string,
        requestBody: InitialGoalCreateRequest,
    }): CancelablePromise<InitialGoalResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/clients/{clientId}/initial-goals',
            path: {
                'clientId': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Add communication style
     * @returns CommunicationResponse Created
     * @throws ApiError
     */
    public createCommunication({
        clientId,
        requestBody,
    }: {
        clientId: string,
        requestBody: CommunicationCreateRequest,
    }): CancelablePromise<CommunicationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/clients/{clientId}/communication',
            path: {
                'clientId': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
