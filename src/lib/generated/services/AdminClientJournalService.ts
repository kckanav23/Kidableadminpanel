/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JournalEntryResponse } from '../models/JournalEntryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminClientJournalService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get client journal entries
     * View journal entries logged by parents for this client
     * @returns JournalEntryResponse OK
     * @throws ApiError
     */
    public getJournalEntries({
        clientId,
        limit = 30,
    }: {
        clientId: string,
        limit?: number,
    }): CancelablePromise<Array<JournalEntryResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/clients/{clientId}/journal',
            path: {
                'clientId': clientId,
            },
            query: {
                'limit': limit,
            },
        });
    }
}
