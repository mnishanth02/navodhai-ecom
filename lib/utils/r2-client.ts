import "server-only"
import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@/data/env/server-env";

// Initialize the S3 client for Cloudflare R2
export const r2Client = new S3Client({
  region: "auto",
  endpoint: env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

export const R2_BUCKET_NAME = env.CLOUDFLARE_R2_BUCKET_NAME;

/**
 * Generate a public URL for an R2 object using the public bucket URL
 * @param key The object key in the R2 bucket
 * @returns A public URL for the object
 */
export function getPublicR2Url(key: string): string {
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  return `${env.CLOUDFLARE_R2_PUBLIC_URL}/${cleanKey}`;
}
