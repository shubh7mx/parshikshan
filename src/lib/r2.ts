import { uuid } from './d1';

export function getR2Bucket(name: string): R2Bucket {
  if (typeof process !== 'undefined' && (process.env as any)?.[name]) {
    return (process.env as any)[name] as R2Bucket;
  }
  throw new Error(`R2 bucket "${name}" not available`);
}

export async function uploadToR2(
  bucket: R2Bucket,
  key: string,
  body: ReadableStream | ArrayBuffer | Blob,
  contentType?: string
): Promise<{ key: string; url: string }> {
  await bucket.put(key, body, {
    httpMetadata: contentType ? { contentType } : undefined,
  });
  return { key, url: `/api/files/${key}` };
}

export async function deleteFromR2(bucket: R2Bucket, key: string): Promise<void> {
  await bucket.delete(key);
}

export async function getFromR2(bucket: R2Bucket, key: string): Promise<R2ObjectBody | null> {
  return bucket.get(key);
}

export function generateFileKey(folder: string, fileName: string): string {
  return `${folder}/${uuid()}-${fileName}`;
}
