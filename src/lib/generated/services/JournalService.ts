/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JournalEntryRequest } from '../models/JournalEntryRequest';
import type { JournalEntryResponse } from '../models/JournalEntryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class JournalService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @returns JournalEntryResponse OK
     * @throws ApiError
     */
    public getEntries({
        clientId,
        limit = 30,
    }: {
        clientId: string,
        limit?: number,
    }): CancelablePromise<Array<JournalEntryResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/client/{clientId}/journal',
            path: {
                'clientId': clientId,
            },
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * Create journal entry
     * Path params:
     * - clientId (uuid, required)
     * Body:
     * - parentId (uuid, required)
     * - entryDate (date, optional, defaults to today)
     * - entryTime (time, optional)
     * - zone (string, required)
     * - energyGivers, energyDrainers, relaxingActivity, additionalNotes (optional)
     * - tags (array of strings)
     * @returns JournalEntryResponse OK
     * @throws ApiError
     */
    public createEntry({
        clientId,
        requestBody,
    }: {
        clientId: string,
        requestBody: JournalEntryRequest,
    }): CancelablePromise<JournalEntryResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/client/{clientId}/journal',
            path: {
                'clientId': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
