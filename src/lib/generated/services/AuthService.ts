/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResponse } from '../models/LoginResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Login with access code
     * Request body:
     * - accessCode (string, required)
     * Responses:
     * - 200 with client/parent data
     * - 401 if code is invalid/inactive
     * @returns LoginResponse OK
     * @throws ApiError
     */
    public login1({
        requestBody,
    }: {
        requestBody: LoginRequest,
    }): CancelablePromise<LoginResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
