import type { ApiResponse, PaginationParams } from '@/types';

export function getDB(): D1Database {
  if (typeof process !== 'undefined' && process.env?.DB) {
    return process.env.DB as unknown as D1Database;
  }
  throw new Error('D1 Database not available. Ensure the DB binding is configured.');
}

export function uuid(): string {
  return crypto.randomUUID();
}

export function parseJSON<T = string[]>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function transformKeys(
  obj: Record<string, unknown> | null | undefined,
  transformer: (key: string) => string
): Record<string, unknown> | null {
  if (!obj) return null;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[transformer(key)] = value;
  }
  return result;
}

export function snakeToCamel<T>(row: Record<string, unknown> | null): T | null {
  if (!row) return null;
  return transformKeys(row, toCamelCase) as unknown as T;
}

export function camelToSnake(obj: Record<string, unknown>): Record<string, unknown> {
  return transformKeys(obj, toSnakeCase) as Record<string, unknown>;
}

export function buildSetClause(data: Record<string, unknown>): { setClause: string; values: unknown[] } {
  const keys = Object.keys(data);
  const setClause = keys.map((k) => `${toSnakeCase(k)} = ?`).join(', ');
  const values = keys.map((k) => {
    const val = data[k];
    if (Array.isArray(val)) return JSON.stringify(val);
    return val;
  });
  return { setClause, values };
}

export function formatPagination(pagination?: PaginationParams): { limitClause: string; offsetClause: string; orderClause: string } {
  const limit = pagination?.limit || 20;
  const page = pagination?.page || 1;
  const offset = (page - 1) * limit;
  let orderClause = '';
  if (pagination?.orderBy) {
    const snake = toSnakeCase(pagination.orderBy);
    const direction = pagination.orderType === 'ASC' ? 'ASC' : 'DESC';
    orderClause = ` ORDER BY ${snake} ${direction}`;
  } else {
    orderClause = ' ORDER BY created_at DESC';
  }
  return {
    limitClause: ` LIMIT ?`,
    offsetClause: ` OFFSET ?`,
    orderClause,
  };
}

export function handleError(error: unknown): ApiResponse {
  console.error('D1 error:', error);
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  return { success: false, error: message, code: 500 };
}
