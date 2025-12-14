/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to update a resource
 */
export type ResourceUpdateRequest = {
    /**
     * Resource title
     */
    title?: string;
    /**
     * Resource description
     */
    description?: string;
    /**
     * Resource type
     */
    type?: ResourceUpdateRequest.type;
    /**
     * Resource category
     */
    category?: string;
    /**
     * File URL
     */
    fileUrl?: string;
    /**
     * File size in bytes
     */
    fileSize?: number;
    /**
     * Whether this is a global resource
     */
    global?: boolean;
};
export namespace ResourceUpdateRequest {
    /**
     * Resource type
     */
    export enum type {
        PDF = 'pdf',
        VIDEO = 'video',
        ARTICLE = 'article',
        WORKSHEET = 'worksheet',
        LINK = 'link',
    }
}

