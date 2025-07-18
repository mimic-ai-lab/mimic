/**
 * Standardized API response helpers for consistent formatting.
 * 
 * Provides helpers for success and error responses that follow
 * the platform's API response standard.
 * 
 * @example
 * // Success response
 * {
 *   "data": {
 *     "id": "123",
 *     "email": "john@example.com",
 *     "name": "John Doe"
 *   }
 * }
 * 
 * // Success response with pagination
 * {
 *   "data": [...],
 *   "pagination": {
 *     "nextCursor": "eyJpZCI6MTI0fQ==",
 *     "hasNext": true
 *   }
 * }
 * 
 * // Error response
 * {
 *   "error": {
 *     "code": "USER_NOT_FOUND",
 *     "message": "User not found",
 *     "details": { "email": "john@example.com" }
 *   }
 * }
 */

export interface PaginationInfo {
    nextCursor?: string;
    hasNext: boolean;
}

export interface SuccessResponse<T> {
    data: T;
    pagination?: PaginationInfo;
}

export interface ErrorResponse {
    error: {
        code: string;
        message: string;
        details?: any;
    };
}

/**
 * Create a success response with optional pagination.
 */
export function createSuccessResponse<T>(
    data: T,
    pagination?: PaginationInfo
): SuccessResponse<T> {
    const response: SuccessResponse<T> = { data };

    if (pagination) {
        response.pagination = pagination;
    }

    return response;
}

/**
 * Create an error response with standardized format.
 */
export function createErrorResponse(
    code: string,
    message: string,
    details?: any
): ErrorResponse {
    return {
        error: {
            code,
            message,
            details
        }
    };
}

/**
 * Standard error codes for the platform.
 */
export enum ErrorCodes {
    // Authentication
    UNAUTHORIZED = "UNAUTHORIZED",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    SESSION_EXPIRED = "SESSION_EXPIRED",

    // User Management
    USER_NOT_FOUND = "USER_NOT_FOUND",
    USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
    EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",

    // Magic Links
    MAGIC_LINK_EXPIRED = "MAGIC_LINK_EXPIRED",
    MAGIC_LINK_INVALID = "MAGIC_LINK_INVALID",
    MAGIC_LINK_RATE_LIMITED = "MAGIC_LINK_RATE_LIMITED",

    // Validation
    VALIDATION_ERROR = "VALIDATION_ERROR",
    INVALID_EMAIL = "INVALID_EMAIL",

    // Server
    INTERNAL_ERROR = "INTERNAL_ERROR",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
}

/**
 * Map Better Auth errors to our standardized error codes.
 */
export function mapBetterAuthError(error: any): { code: string; message: string } {
    // Better Auth error patterns
    const errorMessage = error?.message || error?.toString() || 'Unknown error';

    if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
        return {
            code: ErrorCodes.USER_NOT_FOUND,
            message: 'User not found'
        };
    }

    if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
        return {
            code: ErrorCodes.USER_ALREADY_EXISTS,
            message: 'User already exists'
        };
    }

    if (errorMessage.includes('expired') || errorMessage.includes('invalid token')) {
        return {
            code: ErrorCodes.MAGIC_LINK_EXPIRED,
            message: 'Magic link has expired'
        };
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
        return {
            code: ErrorCodes.MAGIC_LINK_RATE_LIMITED,
            message: 'Too many requests. Please try again later.'
        };
    }

    if (errorMessage.includes('invalid email') || errorMessage.includes('email format')) {
        return {
            code: ErrorCodes.INVALID_EMAIL,
            message: 'Please provide a valid email address'
        };
    }

    // Default error
    return {
        code: ErrorCodes.INTERNAL_ERROR,
        message: 'An unexpected error occurred'
    };
} 