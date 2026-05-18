import type { Prisma } from "@prisma/client";

import { AuthError } from "@/lib/rbac";

export interface Pagination {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export function parsePagination(
  searchParams: URLSearchParams | Record<string, string | undefined>,
  options: { defaultPageSize?: number; maxPageSize?: number } = {},
): Pagination {
  const defaultPageSize = options.defaultPageSize ?? 25;
  const maxPageSize = options.maxPageSize ?? 100;
  const getParam =
    searchParams instanceof URLSearchParams
      ? (key: string) => searchParams.get(key) ?? undefined
      : (key: string) => searchParams[key];

  const page = Number(getParam("page") ?? "1");
  const pageSize = Number(
    getParam("pageSize") ?? getParam("limit") ?? String(defaultPageSize),
  );

  if (!Number.isInteger(page) || page < 1) {
    throw new AuthError(400, "page must be a positive integer");
  }

  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > maxPageSize) {
    throw new AuthError(
      400,
      `pageSize must be an integer between 1 and ${maxPageSize}`,
    );
  }

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

export function paginationMeta(
  pagination: Pick<Pagination, "page" | "pageSize">,
  total: number,
): PaginationMeta {
  return {
    page: pagination.page,
    pageSize: pagination.pageSize,
    total,
    pageCount: Math.ceil(total / pagination.pageSize),
  };
}

export function getSearch(searchParams: URLSearchParams, key = "search") {
  return searchParams.get(key)?.trim() || undefined;
}

export function containsInsensitive(
  value: string | undefined,
): Prisma.StringFilter | undefined {
  return value ? { contains: value, mode: "insensitive" } : undefined;
}
