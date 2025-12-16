/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageResponseParentResponse } from '../models/PageResponseParentResponse';
import type { ParentResponse } from '../models/ParentResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminParentsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List/search parents
     * Search parents by name, email, or phone
     * @returns PageResponseParentResponse OK
     * @throws ApiError
     */
    public list7({
        status,
        q,
        page,
        size = 20,
    }: {
        status?: string,
        q?: string,
        page?: number,
        size?: number,
    }): CancelablePromise<PageResponseParentResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/parents',
            query: {
                'status': status,
                'q': q,
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * Get parent details
     * @returns ParentResponse OK
     * @throws ApiError
     */
    public get4({
        parentId,
    }: {
        parentId: string,
    }): CancelablePromise<ParentResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/parents/{parentId}',
            path: {
                'parentId': parentId,
            },
        });
    }
}
