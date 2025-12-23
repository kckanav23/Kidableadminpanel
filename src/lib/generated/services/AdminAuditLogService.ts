/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuditLogResponse } from '../models/AuditLogResponse';
import type { PageResponseAuditLogResponse } from '../models/PageResponseAuditLogResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminAuditLogService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List audit logs
     * Admin-only endpoint. Filter by resourceType, userId, or date range.
     * @returns PageResponseAuditLogResponse OK
     * @throws ApiError
     */
    public list7({
        resourceType,
        userId,
        from,
        to,
        page,
        size = 50,
    }: {
        resourceType?: string,
        userId?: string,
        from?: string,
        to?: string,
        page?: number,
        size?: number,
    }): CancelablePromise<PageResponseAuditLogResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/audit',
            query: {
                'resourceType': resourceType,
                'userId': userId,
                'from': from,
                'to': to,
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * Get audit history for a specific resource
     * @returns AuditLogResponse OK
     * @throws ApiError
     */
    public getByResource({
        resourceId,
    }: {
        resourceId: string,
    }): CancelablePromise<Array<AuditLogResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/audit/resource/{resourceId}',
            path: {
                'resourceId': resourceId,
            },
        });
    }
}
