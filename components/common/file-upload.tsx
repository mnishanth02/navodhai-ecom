"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useR2Upload } from "@/hooks/general/use-r2-upload";
import { FILE_UPLOAD_MAXSIZE } from "@/lib/config/constants";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, FileIcon, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

interface FileUploadProps {
  /**
   * Callback function when a file is successfully uploaded
   */
  onUploadComplete?: (fileUrl: string) => void;

  /**
   * Callback function when upload fails
   */
  onUploadError?: (error: Error) => void;

  /**
   * Folder path within the R2 bucket
   * @default "uploads"
   */
  folder?: string;

  /**
   * Accepted file types
   * @default "image/*"
   */
  accept?: string;

  /**
   * Maximum file size in bytes
   * @default 3145728 (3MB)
   */
  maxSize?: number;

  /**
   * Whether the upload is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Initial file URL if already uploaded
   */
  initialFileUrl?: string;

  /**
   * CSS class name for the container
   */
  className?: string;
}

export function FileUpload({
  onUploadComplete,
  onUploadError,
  folder = "uploads",
  accept = "image/*",
  maxSize = FILE_UPLOAD_MAXSIZE, // 3MB to match Next.js server action limit
  disabled = false,
  initialFileUrl,
  className,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialFileUrl || null);
  const [fileName, setFileName] = useState<string | null>(null);

  const { uploadFile, resetUpload, isUploading, uploadedFileUrl } = useR2Upload({
    folder,
    onUploadComplete: (fileUrl) => {
      setPreviewUrl(fileUrl);
      onUploadComplete?.(fileUrl);
    },
    onUploadError: (err) => {
      setError(err.message);
      onUploadError?.(err);
    },
  });

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file size
      if (file.size > maxSize) {
        setError(
          `File size exceeds the maximum allowed size (${Math.round(maxSize / 1024 / 1024)}MB)`,
        );
        return;
      }

      // Clear previous errors
      setError(null);

      // Set filename for display
      setFileName(file.name);

      // Create a temporary preview URL
      const tempPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(tempPreviewUrl);

      // Upload the file
      await uploadFile(file);

      // Clean up the temporary URL
      URL.revokeObjectURL(tempPreviewUrl);
    },
    [maxSize, uploadFile],
  );

  const handleRemove = useCallback(() => {
    if (previewUrl && !initialFileUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName(null);
    setError(null);
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl, initialFileUrl, resetUpload]);

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isUploading]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && !isUploading) {
        setIsDragging(true);
      }
    },
    [disabled, isUploading],
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled || isUploading) return;

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      // Check if file type is accepted
      if (accept && !file.type.match(accept.replace(/\*/g, ".*"))) {
        setError(`File type not accepted. Please upload ${accept.replace("*", "")} files.`);
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        setError(
          `File size exceeds the maximum allowed size (${Math.round(maxSize / 1024 / 1024)}MB)`,
        );
        return;
      }

      // Clear previous errors
      setError(null);

      // Set filename for display
      setFileName(file.name);

      // Create a temporary preview URL
      const tempPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(tempPreviewUrl);

      // Upload the file
      uploadFile(file).catch(() => {
        // Clean up the temporary URL on error
        URL.revokeObjectURL(tempPreviewUrl);
      });
    },
    [accept, disabled, isUploading, maxSize, uploadFile],
  );

  const isImage = previewUrl && previewUrl.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null;

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        accept={accept}
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />

      {/* Upload area */}
      {!previewUrl ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-6 transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          <div className="rounded-full bg-primary/10 p-3">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1 text-center">
            <p className="font-medium text-sm">
              {isDragging ? "Drop your file here" : "Drag & drop your file here"}
            </p>
            <p className="text-muted-foreground text-xs">or click to browse</p>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-lg border">
          {/* Preview */}
          <div className="relative flex aspect-video items-center justify-center bg-muted">
            {isImage ? (
              <Image
                src={previewUrl}
                alt="Preview"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                fill
                className="object-cover"
                quality={60}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 p-4">
                <FileIcon className="h-10 w-10 text-primary" />
                <span className="max-w-full break-all px-2 text-center font-medium text-sm">
                  {fileName || "File"}
                </span>
              </div>
            )}
          </div>

          {/* Upload progress */}
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="w-full max-w-xs space-y-2">
                <Progress value={50} className="h-2 w-full animate-pulse" />
                <p className="text-center text-muted-foreground text-xs">Uploading...</p>
              </div>
            </div>
          )}

          {/* Success indicator */}
          {uploadedFileUrl && !isUploading && (
            <div className="absolute top-2 right-2 rounded-full bg-primary p-1 text-primary-foreground">
              <Check className="h-4 w-4" />
            </div>
          )}

          {/* Remove button */}
          {!isUploading && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 left-2"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
