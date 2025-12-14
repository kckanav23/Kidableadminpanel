/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MoodEntryRequest } from '../models/MoodEntryRequest';
import type { MoodEntryResponse } from '../models/MoodEntryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MoodService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @returns MoodEntryResponse OK
     * @throws ApiError
     */
    public getMoodEntries({
        clientId,
        days = 30,
    }: {
        clientId: string,
        days?: number,
    }): CancelablePromise<Array<MoodEntryResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/client/{clientId}/mood',
            path: {
                'clientId': clientId,
            },
            query: {
                'days': days,
            },
        });
    }
    /**
     * Log mood entry
     * Path params:
     * - clientId (uuid, required)
     * Body:
     * - parentId (uuid, optional)
     * - entryDate (date, optional, defaults to today)
     * - mood (required)
     * - zone (optional)
     * - energyLevel (optional)
     * - emoji (optional)
     * - notes (optional)
     * @returns MoodEntryResponse OK
     * @throws ApiError
     */
    public logMood({
        clientId,
        requestBody,
    }: {
        clientId: string,
        requestBody: MoodEntryRequest,
    }): CancelablePromise<MoodEntryResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/client/{clientId}/mood',
            path: {
                'clientId': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
