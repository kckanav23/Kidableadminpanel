/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Resource library entry
 */
export type ResourceLibraryResponse = {
    /**
     * Resource ID
     */
    id?: string;
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
    type?: ResourceLibraryResponse.type;
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
    /**
     * Name of user who uploaded this resource
     */
    uploadedBy?: string;
    /**
     * Creation timestamp
     */
    createdAt?: string;
    /**
     * Last update timestamp
     */
    updatedAt?: string;
};
export namespace ResourceLibraryResponse {
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

