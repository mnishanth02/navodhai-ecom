import { deleteFileFromR2, uploadFileToR2 } from "@/data/actions/upload.actions";
import { ActionError } from "@/lib/error";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseR2UploadOptions {
  /**
   * Folder path within the R2 bucket
   * @default "uploads"
   */
  folder?: string;

  /**
   * Callback function called when upload completes successfully
   */
  onUploadComplete?: (fileUrl: string) => void;

  /**
   * Callback function called when upload fails
   */
  onUploadError?: (error: Error) => void;

  /**
   * Callback function called when delete completes successfully
   */
  onDeleteComplete?: (fileUrl: string) => void;

  /**
   * Callback function called when delete fails
   */
  onDeleteError?: (error: Error) => void;
}

export function useR2Upload({
  folder = "uploads",
  onUploadComplete,
  onUploadError,
  onDeleteComplete,
  onDeleteError,
}: UseR2UploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingFileUrl, setDeletingFileUrl] = useState<string | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

  /**
   * Upload a file to R2 and get its public URL
   */
  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      if (!file) return null;

      try {
        setIsUploading(true);

        const result = await uploadFileToR2({
          file,
          folder,
        });

        if (!result?.data) {
          throw new ActionError("Upload failed");
        }

        setUploadedFileUrl(result.data.fileUrl);
        onUploadComplete?.(result.data.fileUrl);
        return result.data.fileUrl;
      } catch (error) {
        console.error("Error uploading file:", error);
        const err = error instanceof Error ? error : new Error("Failed to upload file");
        onUploadError?.(err);
        toast.error(err.message);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [folder, onUploadComplete, onUploadError],
  );

  /**
   * Delete a file from R2
   */
  const deleteFile = useCallback(
    async (fileUrl: string): Promise<boolean> => {
      if (!fileUrl) return false;

      try {
        setIsDeleting(true);
        setDeletingFileUrl(fileUrl);

        const result = await deleteFileFromR2({
          fileUrl,
        });

        if (!result?.data?.success) {
          throw new ActionError("Delete failed");
        }

        onDeleteComplete?.(fileUrl);
        return true;
      } catch (error) {
        console.error("Error deleting file:", error);
        const err = error instanceof Error ? error : new Error("Failed to delete file");
        onDeleteError?.(err);
        toast.error(err.message);
        return false;
      } finally {
        setIsDeleting(false);
        setDeletingFileUrl(null);
      }
    },
    [onDeleteComplete, onDeleteError],
  );

  /**
   * Reset the upload state
   */
  const resetUpload = useCallback(() => {
    setUploadedFileUrl(null);
  }, []);

  return {
    uploadFile,
    deleteFile,
    resetUpload,
    isUploading,
    isDeleting,
    deletingFileUrl,
    uploadedFileUrl,
  };
}
