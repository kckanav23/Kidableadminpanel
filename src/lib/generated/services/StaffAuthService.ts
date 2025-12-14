/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StaffLoginRequest } from '../models/StaffLoginRequest';
import type { StaffLoginResponse } from '../models/StaffLoginResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class StaffAuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Login with staff access code
     * @returns StaffLoginResponse OK
     * @throws ApiError
     */
    public login({
        requestBody,
    }: {
        requestBody: StaffLoginRequest,
    }): CancelablePromise<StaffLoginResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/staff/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
