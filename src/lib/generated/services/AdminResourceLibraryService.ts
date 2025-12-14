/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageResponseResourceLibraryResponse } from '../models/PageResponseResourceLibraryResponse';
import type { ResourceCreateRequest } from '../models/ResourceCreateRequest';
import type { ResourceLibraryResponse } from '../models/ResourceLibraryResponse';
import type { ResourceUpdateRequest } from '../models/ResourceUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminResourceLibraryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List resources in library
     * Browse all resources. Filter by type, category, global flag, or search term.
     * @returns PageResponseResourceLibraryResponse OK
     * @throws ApiError
     */
    public list3({
        type,
        category,
        global,
        q,
        page,
        size = 20,
    }: {
        type?: string,
        category?: string,
        global?: boolean,
        q?: string,
        page?: number,
        size?: number,
    }): CancelablePromise<PageResponseResourceLibraryResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/resources',
            query: {
                'type': type,
                'category': category,
                'global': global,
                'q': q,
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * Create resource
     * Add a new resource to the library
     * @returns ResourceLibraryResponse Created
     * @throws ApiError
     */
    public create3({
        requestBody,
    }: {
        requestBody: ResourceCreateRequest,
    }): CancelablePromise<ResourceLibraryResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/resources',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get resource details
     * @returns ResourceLibraryResponse OK
     * @throws ApiError
     */
    public get2({
        resourceId,
    }: {
        resourceId: string,
    }): CancelablePromise<ResourceLibraryResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/resources/{resourceId}',
            path: {
                'resourceId': resourceId,
            },
        });
    }
    /**
     * Delete resource
     * Soft deletes the resource from the library
     * @returns void
     * @throws ApiError
     */
    public delete2({
        resourceId,
    }: {
        resourceId: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/resources/{resourceId}',
            path: {
                'resourceId': resourceId,
            },
        });
    }
    /**
     * Update resource
     * @returns ResourceLibraryResponse OK
     * @throws ApiError
     */
    public update3({
        resourceId,
        requestBody,
    }: {
        resourceId: string,
        requestBody: ResourceUpdateRequest,
    }): CancelablePromise<ResourceLibraryResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/admin/resources/{resourceId}',
            path: {
                'resourceId': resourceId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
