/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ParentResponse } from './ParentResponse';
/**
 * Paginated response wrapper
 */
export type PageResponseParentResponse = {
    /**
     * List of items
     */
    items?: Array<ParentResponse>;
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

