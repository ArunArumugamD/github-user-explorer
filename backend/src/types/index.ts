// src/types/index.ts
import { Request } from 'express';

export interface UsernameParams {
    username: string;
}

export interface SearchQuery {
    query?: string;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
}

export interface UpdateUserBody {
    location?: string;
    blog?: string;
    bio?: string;
}

export interface ApiError {
    status: string;
    message: string;
}

export interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
}