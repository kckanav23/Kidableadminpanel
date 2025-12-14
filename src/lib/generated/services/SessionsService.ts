/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SessionResponse } from '../models/SessionResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SessionsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List sessions
     * Recent sessions for a client, with therapist and activities.
     * @returns SessionResponse OK
     * @throws ApiError
     */
    public getSessions1({
        clientId,
        limit = 20,
    }: {
        clientId: string,
        limit?: number,
    }): CancelablePromise<Array<SessionResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/client/{clientId}/sessions',
            path: {
                'clientId': clientId,
            },
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * Get session by id
     * Path params:
     * - clientId (uuid, required)
     * - sessionId (uuid, required)
     * Returns session with therapist and activities.
     * @returns SessionResponse OK
     * @throws ApiError
     */
    public getSession1({
        clientId,
        sessionId,
    }: {
        clientId: string,
        sessionId: string,
    }): CancelablePromise<SessionResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/client/{clientId}/sessions/{sessionId}',
            path: {
                'clientId': clientId,
                'sessionId': sessionId,
            },
        });
    }
}
