/**
 * Standardized API response utilities
 * Provides consistent error and success response formatting across all routes
 */

export interface StandardError {
  error: string;
  code?: number;
  details?: any;
}

export interface StandardSuccess<T = any> {
  success: true;
  data?: T;
  message?: string;
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  res: any,
  error: string,
  code: number = 500,
  details?: any
): void {
  const errorResponse: StandardError = {
    error,
    code,
    details
  };

  res.status(code).json(errorResponse);
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(
  res: any,
  data: T,
  message?: string,
  code: number = 200
): void {
  const successResponse: StandardSuccess<T> = {
    success: true,
    data,
    message
  };

  res.status(code).json(successResponse);
}

/**
 * Handle async route errors consistently
 */
export function handleRouteError(
  res: any,
  error: any,
  context: string = "Request"
): void {
  console.error(`${context} error:`, error);
  
  if (error.name === 'ValidationError') {
    createErrorResponse(res, error.message, 400);
  } else if (error.name === 'AuthenticationError') {
    createErrorResponse(res, error.message, 401);
  } else {
    createErrorResponse(res, error.message || "Internal server error");
  }
}

/**
 * Validate request body parameters
 */
export function validateRequestBody(body: any, required: string[]): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  for (const field of required) {
    if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
      missing.push(field);
    }
  }

  return {
    isValid: missing.length === 0,
    missing
  };
}
