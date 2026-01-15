/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageResponseSessionResponse } from '../models/PageResponseSessionResponse';
import type { SessionCreateRequest } from '../models/SessionCreateRequest';
import type { SessionResponse } from '../models/SessionResponse';
import type { SessionUpdateRequest } from '../models/SessionUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminSessionsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List sessions (staff scoped)
     * @returns SessionResponse OK
     * @throws ApiError
     */
    public getSessions({
        clientId,
        limit = 20,
    }: {
        clientId: string,
        limit?: number,
    }): CancelablePromise<Array<SessionResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/clients/{clientId}/sessions',
            path: {
                'clientId': clientId,
            },
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * Create session (staff scoped)
     * @returns SessionResponse OK
     * @throws ApiError
     */
    public createSession({
        clientId,
        requestBody,
    }: {
        clientId: string,
        requestBody: SessionCreateRequest,
    }): CancelablePromise<SessionResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/clients/{clientId}/sessions',
            path: {
                'clientId': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get session by id (staff scoped)
     * @returns SessionResponse OK
     * @throws ApiError
     */
    public getSession({
        clientId,
        sessionId,
    }: {
        clientId: string,
        sessionId: string,
    }): CancelablePromise<SessionResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/clients/{clientId}/sessions/{sessionId}',
            path: {
                'clientId': clientId,
                'sessionId': sessionId,
            },
        });
    }
    /**
     * Delete session (soft, staff scoped)
     * @returns any OK
     * @throws ApiError
     */
    public deleteSession({
        clientId,
        sessionId,
    }: {
        clientId: string,
        sessionId: string,
    }): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/clients/{clientId}/sessions/{sessionId}',
            path: {
                'clientId': clientId,
                'sessionId': sessionId,
            },
        });
    }
    /**
     * Update session (staff scoped)
     * @returns SessionResponse OK
     * @throws ApiError
     */
    public updateSession({
        clientId,
        sessionId,
        requestBody,
    }: {
        clientId: string,
        sessionId: string,
        requestBody: SessionUpdateRequest,
    }): CancelablePromise<SessionResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/admin/clients/{clientId}/sessions/{sessionId}',
            path: {
                'clientId': clientId,
                'sessionId': sessionId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List sessions (paginated)
     * Admins can set all=true to list all sessions. Otherwise lists sessions for current therapist.
     * @returns PageResponseSessionResponse OK
     * @throws ApiError
     */
    public listSessions({
        therapistId,
        all = false,
        page,
        size = 20,
    }: {
        therapistId?: string,
        all?: boolean,
        page?: number,
        size?: number,
    }): CancelablePromise<PageResponseSessionResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/sessions',
            query: {
                'therapistId': therapistId,
                'all': all,
                'page': page,
                'size': size,
            },
        });
    }
}
