/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Request to create a resource in the library
 */
export type ResourceCreateRequest = {
    /**
     * Resource title
     */
    title: string;
    /**
     * Resource description
     */
    description?: string;
    /**
     * Resource type
     */
    type: ResourceCreateRequest.type;
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
     * Whether this is a global resource (defaults to true)
     */
    global?: boolean;
};
export namespace ResourceCreateRequest {
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

