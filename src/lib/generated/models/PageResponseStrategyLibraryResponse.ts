/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StrategyLibraryResponse } from './StrategyLibraryResponse';
/**
 * Paginated response wrapper
 */
export type PageResponseStrategyLibraryResponse = {
    /**
     * List of items
     */
    items?: Array<StrategyLibraryResponse>;
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

