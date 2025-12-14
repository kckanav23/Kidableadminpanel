/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientSummaryResponse } from './ClientSummaryResponse';
/**
 * Paginated response wrapper
 */
export type PageResponseClientSummaryResponse = {
    /**
     * List of items
     */
    items?: Array<ClientSummaryResponse>;
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

