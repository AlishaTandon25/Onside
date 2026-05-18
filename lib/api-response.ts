// ─────────────────────────────────────────────────────────
//  Onside — Standardized API Response Helpers
//  Use these in every API route for consistent error shapes.
// ─────────────────────────────────────────────────────────

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthError } from "@/lib/rbac";

// ─────────────────────────────────────────────────────────
//  Success
// ─────────────────────────────────────────────────────────

/**
 * Return a JSON success response.
 *
 * ```ts
 * return success({ goals }, 200);
 * ```
 */
export function success<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

/**
 * Return a 201 Created response with the new resource.
 */
export function created<T>(data: T): NextResponse {
  return NextResponse.json(data, { status: 201 });
}

// ─────────────────────────────────────────────────────────
//  Errors
// ─────────────────────────────────────────────────────────

interface ErrorBody {
  error: string;
  details?: unknown;
}

function errorResponse(
  status: number,
  message: string,
  details?: unknown,
): NextResponse<ErrorBody> {
  const body: ErrorBody = { error: message };
  if (details !== undefined) body.details = details;
  return NextResponse.json(body, { status });
}

/** 400 Bad Request — malformed input, validation failure, etc. */
export function badRequest(
  message = "Bad request",
  details?: unknown,
): NextResponse<ErrorBody> {
  return errorResponse(400, message, details);
}

/** 401 Unauthorized — no valid session / token. */
export function unauthorized(
  message = "Authentication required",
): NextResponse<ErrorBody> {
  return errorResponse(401, message);
}

/** 403 Forbidden — authenticated but insufficient permissions. */
export function forbidden(
  message = "You do not have permission to perform this action",
): NextResponse<ErrorBody> {
  return errorResponse(403, message);
}

/** 404 Not Found. */
export function notFound(
  message = "Resource not found",
): NextResponse<ErrorBody> {
  return errorResponse(404, message);
}

/** 409 Conflict — duplicate key, etc. */
export function conflict(
  message = "Resource already exists",
): NextResponse<ErrorBody> {
  return errorResponse(409, message);
}

/** 500 Internal Server Error — unexpected failures. */
export function internalError(
  message = "Internal server error",
): NextResponse<ErrorBody> {
  return errorResponse(500, message);
}

// ─────────────────────────────────────────────────────────
//  handleApiError
//  Catch-all that maps known error types to proper responses.
// ─────────────────────────────────────────────────────────

/**
 * Wraps API route handlers to catch `AuthError` and other
 * known exceptions, returning the correct HTTP status.
 *
 * ```ts
 * export async function GET() {
 *   try {
 *     const user = await requireRole(Resource.GOALS, Action.READ);
 *     // ...
 *   } catch (error) {
 *     return handleApiError(error);
 *   }
 * }
 * ```
 */
export function handleApiError(error: unknown): NextResponse<ErrorBody> {
  if (error instanceof AuthError) {
    return errorResponse(error.statusCode, error.message);
  }

  if (error instanceof ZodError) {
    return badRequest(
      error.issues[0]?.message ?? "Validation failed",
      error.flatten(),
    );
  }

  console.error("[API Error]", error);
  return internalError();
}
