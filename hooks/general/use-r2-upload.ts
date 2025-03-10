import { useCallback, useState } from "react";
import { toast } from "sonner";
import { uploadFileToR2 } from "@/data/actions/upload.actions";
import { ActionError } from "@/lib/error";

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
}

export function useR2Upload({
  folder = "uploads",
  onUploadComplete,
  onUploadError,
}: UseR2UploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
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
    [folder, onUploadComplete, onUploadError]
  );

  /**
   * Reset the upload state
   */
  const resetUpload = useCallback(() => {
    setUploadedFileUrl(null);
  }, []);

  return {
    uploadFile,
    resetUpload,
    isUploading,
    uploadedFileUrl,
  };
}
