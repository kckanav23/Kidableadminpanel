/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResourceLibraryResponse } from './ResourceLibraryResponse';
/**
 * Paginated response wrapper
 */
export type PageResponseResourceLibraryResponse = {
    /**
     * List of items
     */
    items?: Array<ResourceLibraryResponse>;
    /**
     * Total number of items
     */
    total?: number;
    /**
     * Current page number (0-indexed)
     */
    page?: number;
    /**
     * Page size
     */
    size?: number;
    /**
     * Total number of pages
     */
    totalPages?: number;
};

