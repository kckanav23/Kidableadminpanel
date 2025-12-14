/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageResponseTherapistResponse } from '../models/PageResponseTherapistResponse';
import type { TherapistCreateRequest } from '../models/TherapistCreateRequest';
import type { TherapistResponse } from '../models/TherapistResponse';
import type { TherapistUpdateRequest } from '../models/TherapistUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminTherapistsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List therapists
     * List all therapists with optional status and search filters
     * @returns PageResponseTherapistResponse OK
     * @throws ApiError
     */
    public list({
        status,
        q,
        page,
        size = 20,
    }: {
        status?: string,
        q?: string,
        page?: number,
        size?: number,
    }): CancelablePromise<PageResponseTherapistResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/therapists',
            query: {
                'status': status,
                'q': q,
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * Create therapist
     * Create a new therapist. Optionally generates an access code.
     * @returns TherapistResponse Created
     * @throws ApiError
     */
    public create({
        requestBody,
    }: {
        requestBody: TherapistCreateRequest,
    }): CancelablePromise<TherapistResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/admin/therapists',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get therapist details
     * @returns TherapistResponse OK
     * @throws ApiError
     */
    public get({
        therapistId,
    }: {
        therapistId: string,
    }): CancelablePromise<TherapistResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/therapists/{therapistId}',
            path: {
                'therapistId': therapistId,
            },
        });
    }
    /**
     * Deactivate therapist
     * Sets the therapist status to inactive
     * @returns void
     * @throws ApiError
     */
    public deactivate({
        therapistId,
    }: {
        therapistId: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/admin/therapists/{therapistId}',
            path: {
                'therapistId': therapistId,
            },
        });
    }
    /**
     * Update therapist
     * @returns TherapistResponse OK
     * @throws ApiError
     */
    public update1({
        therapistId,
        requestBody,
    }: {
        therapistId: string,
        requestBody: TherapistUpdateRequest,
    }): CancelablePromise<TherapistResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/admin/therapists/{therapistId}',
            path: {
                'therapistId': therapistId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
