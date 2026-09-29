export interface PageRequest {
    pageNumber: number;
    pageSize: number;
    sortBy?: string;
    sortDirection?: "ASC" | "DESC";
}

export interface PageResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    first: boolean;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
}

export interface UuidAndTitle {
    uuid: string;
    title: string;
}

export const DEFAULT_PAGE_REQUEST = {
    pageNumber: 0,
    pageSize: 10,
} as const;
