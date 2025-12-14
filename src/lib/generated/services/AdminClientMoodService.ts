/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MoodEntryResponse } from '../models/MoodEntryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AdminClientMoodService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get client mood entries
     * View mood entries logged by parents for this client
     * @returns MoodEntryResponse OK
     * @throws ApiError
     */
    public getMoodEntries1({
        clientId,
        days = 30,
    }: {
        clientId: string,
        days?: number,
    }): CancelablePromise<Array<MoodEntryResponse>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/admin/clients/{clientId}/mood',
            path: {
                'clientId': clientId,
            },
            query: {
                'days': days,
            },
        });
    }
}
