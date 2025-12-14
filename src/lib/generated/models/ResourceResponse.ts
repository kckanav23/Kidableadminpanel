/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UploadedByUser } from './UploadedByUser';
export type ResourceResponse = {
    /**
     * Resource id
     */
    id?: string;
    /**
     * Title
     */
    title?: string;
    /**
     * Description
     */
    description?: string;
    /**
     * Type
     */
    type?: ResourceResponse.type;
    /**
     * Category
     */
    category?: string;
    /**
     * File URL
     */
    fileUrl?: string;
    /**
     * Is global
     */
    isGlobal?: boolean;
    uploadedByUser?: UploadedByUser;
    /**
     * Shared date to client
     */
    sharedDate?: string;
    /**
     * Notes
     */
    notes?: string;
    /**
     * Created at
     */
    createdAt?: string;
};
export namespace ResourceResponse {
    /**
     * Type
     */
    export enum type {
        PDF = 'pdf',
        VIDEO = 'video',
        ARTICLE = 'article',
        WORKSHEET = 'worksheet',
        LINK = 'link',
    }
}

