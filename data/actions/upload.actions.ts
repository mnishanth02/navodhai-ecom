"use server";

import { ActionError } from "@/lib/error";
import { R2_BUCKET_NAME, getPublicR2Url, r2Client } from "@/lib/utils/r2-client";
import { authActionClient } from "@/lib/utils/safe-action";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

// Allowed file types
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number];

// Schema for file upload
const UploadSchema = z
  .object({
    file: z.instanceof(File),
    folder: z.string().default("uploads"),
  })
  .refine(
    (data) => ALLOWED_FILE_TYPES.includes(data.file.type as AllowedFileType),
    (data) => ({
      message: `File type ${data.file.type} is not supported. Supported types: ${ALLOWED_FILE_TYPES.join(", ")}`,
    }),
  );

interface UploadResult {
  fileUrl: string;
  key: string;
}

/**
 * Upload a file directly to R2 and return its public URL
 */
export const uploadFileToR2 = authActionClient
  .metadata({
    actionName: "uploadFileToR2",
    requiresAuth: true,
  })
  .schema(UploadSchema)
  .action(async ({ parsedInput }): Promise<UploadResult> => {
    try {
      const { file, folder } = parsedInput;

      // Generate a unique file key
      const fileExtension = file.name.split(".").pop() || "";
      const uniqueFilename = `${uuidv4()}.${fileExtension}`;
      const key = `${folder}/${uniqueFilename}`;

      // Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Upload the file to R2
      await r2Client.send(
        new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          CacheControl: "public, max-age=31536000", // Cache for 1 year
        }),
      );

      // Return the public URL for the uploaded file
      const fileUrl = getPublicR2Url(key);

      return { fileUrl, key };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new ActionError(error instanceof Error ? error.message : "Failed to upload file");
    }
  });
