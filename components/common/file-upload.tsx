"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useR2Upload } from "@/hooks/general/use-r2-upload";
import { FILE_UPLOAD_MAXSIZE } from "@/lib/config/constants";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, FileIcon, Loader2, Plus, Trash, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Input } from "../ui/input";

interface FileUploadProps {
  /**
   * Callback function when files are successfully uploaded or primary image is changed
   */
  onUploadComplete?: (fileUrls: string[], primaryImageUrl?: string) => void;

  /**
   * Callback function when upload fails
   */
  onUploadError?: (error: Error) => void;

  /**
   * Initial primary image URL
   */
  primaryImageUrl?: string;

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
   * Initial file URLs if already uploaded
   */
  initialFileUrls?: string[];

  /**
   * Whether to allow multiple file uploads
   * @default false
   */
  multiple?: boolean;

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
  initialFileUrls = [],
  primaryImageUrl,
  multiple = false,
  className,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileItems, setFileItems] = useState<
    Array<{
      url: string;
      name: string | null;
      isUploading: boolean;
      isUploaded: boolean;
      isDeleting: boolean;
      isPrimary: boolean;
    }>
  >(
    initialFileUrls.map((url) => ({
      url,
      name: url.split("/").pop() || null,
      isUploading: false,
      isUploaded: true,
      isDeleting: false,
      isPrimary: url === primaryImageUrl,
    })),
  );

  const { uploadFile, deleteFile, resetUpload, isUploading } = useR2Upload({
    folder,
    onUploadComplete: (fileUrl) => {
      setFileItems((prev) => {
        const updatedItems = prev.map((item) => {
          if (item.isUploading) {
            return { ...item, url: fileUrl, isUploading: false, isUploaded: true };
          }
          return item;
        });

        // Update parent component with the latest URLs after state update
        setTimeout(() => {
          onUploadComplete?.(
            updatedItems
              .map((item) => (item.isUploaded ? item.url : null))
              .filter(Boolean) as string[],
          );
        }, 0);

        return updatedItems;
      });
    },
    onUploadError: (err) => {
      setError(err.message);
      onUploadError?.(err);
    },
  });

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      // Clear previous errors
      setError(null);

      // Process each file
      const filesToProcess = multiple ? Array.from(files) : [files[0]];

      for (const file of filesToProcess) {
        // Validate file size
        if (file.size > maxSize) {
          setError(
            `File size exceeds the maximum allowed size (${Math.round(maxSize / 1024 / 1024)}MB)`,
          );
          continue;
        }

        // Create a temporary preview URL
        const tempPreviewUrl = URL.createObjectURL(file);

        // Add new file to the list
        setFileItems((prev) => {
          const isPrimary = prev.length === 0;
          return [
            ...prev,
            {
              url: tempPreviewUrl,
              name: file.name,
              isUploading: true,
              isUploaded: false,
              isDeleting: false,
              isPrimary,
            },
          ];
        });

        // Upload the file
        try {
          await uploadFile(file);
        } catch {
          // Handle error - already handled by onUploadError callback
        } finally {
          // Clean up the temporary URL
          URL.revokeObjectURL(tempPreviewUrl);
        }
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [maxSize, uploadFile, multiple],
  );

  const handleRemove = useCallback(
    async (index: number) => {
      const itemToRemove = fileItems[index];
      if (!itemToRemove) return;

      try {
        // Mark the file as deleting
        setFileItems((prev) => {
          const newItems = [...prev];
          if (newItems[index]) {
            newItems[index] = { ...newItems[index], isDeleting: true };
          }
          return newItems;
        });

        // If it's an uploaded file (not a temporary URL), delete it from R2
        if (itemToRemove.isUploaded && itemToRemove.url) {
          await deleteFile(itemToRemove.url);
        }

        // If it's a temporary URL, revoke it
        if (itemToRemove.url && !initialFileUrls.includes(itemToRemove.url)) {
          URL.revokeObjectURL(itemToRemove.url);
        }

        // Remove the item from the list and notify parent
        setFileItems((prev) => {
          const newItems = prev.filter((_, i) => i !== index);
          // Update parent component with remaining URLs
          requestAnimationFrame(() => {
            onUploadComplete?.(
              newItems
                .map((item) => (item.isUploaded ? item.url : null))
                .filter(Boolean) as string[],
            );
          });
          return newItems;
        });

        setError(null);
        resetUpload();
      } catch (error) {
        console.error("Error deleting file:", error);
        const err = error instanceof Error ? error : new Error("Failed to delete file");
        setError(err.message);
        onUploadError?.(err);

        // Revert the deleting state
        setFileItems((prev) => {
          const newItems = [...prev];
          if (newItems[index]) {
            newItems[index] = { ...newItems[index], isDeleting: false };
          }
          return newItems;
        });
      }
    },
    [fileItems, initialFileUrls, resetUpload, onUploadComplete, onUploadError, deleteFile],
  );

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

      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;

      // Clear previous errors
      setError(null);

      // Process each file
      const filesToProcess = multiple ? Array.from(files) : [files[0]];

      for (const file of filesToProcess) {
        // Check if file type is accepted
        if (accept && !file.type.match(accept.replace(/\*/g, ".*"))) {
          setError(`File type not accepted. Please upload ${accept.replace("*", "")} files.`);
          continue;
        }

        // Validate file size
        if (file.size > maxSize) {
          setError(
            `File size exceeds the maximum allowed size (${Math.round(maxSize / 1024 / 1024)}MB)`,
          );
          continue;
        }

        // Create a temporary preview URL
        const tempPreviewUrl = URL.createObjectURL(file);

        // Add new file to the list
        setFileItems((prev) => [
          ...prev,
          {
            url: tempPreviewUrl,
            name: file.name,
            isUploading: true,
            isUploaded: false,
            isDeleting: false,
            isPrimary: fileItems.length === 0,
          },
        ]);

        // Upload the file
        uploadFile(file).catch(() => {
          // Clean up the temporary URL on error
          URL.revokeObjectURL(tempPreviewUrl);
        });
      }
    },
    [accept, disabled, isUploading, maxSize, uploadFile, multiple],
  );

  return (
    <div className={cn("w-full", className)}>
      <Input
        type="file"
        accept={accept}
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        multiple={multiple}
      />

      {/* Grid preview of uploaded files */}
      {fileItems.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {fileItems.map((item, index) => {
            const isImage = item.url && item.url.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null;

            return (
              <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                {/* Preview */}
                <div className="relative flex h-full w-full items-center justify-center bg-muted">
                  {isImage ? (
                    <Image
                      src={item.url}
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
                        {item.name || "File"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Upload progress */}
                {item.isUploading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/80 p-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <div className="w-full max-w-xs space-y-2">
                      <Progress value={50} className="h-2 w-full animate-pulse" />
                      <p className="text-center text-muted-foreground text-xs">Uploading...</p>
                    </div>
                  </div>
                )}

                {/* Primary image selector */}
                {item.isUploaded && (
                  <Button
                    type="button"
                    variant={item.isPrimary ? "default" : "outline"}
                    size="icon"
                    className="absolute top-2 right-2 transform rounded-full bg-background/80 hover:bg-background"
                    onClick={() => {
                      if (!item.isPrimary) {
                        setFileItems((prev) => {
                          const newItems = prev.map((i) => ({
                            ...i,
                            isPrimary: i.url === item.url,
                          }));
                          // Notify parent about primary image change
                          const primaryUrl = item.url;
                          requestAnimationFrame(() => {
                            onUploadComplete?.(
                              newItems.map((i) => i.url),
                              primaryUrl,
                            );
                          });
                          return newItems;
                        });
                      }
                    }}
                    disabled={disabled || item.isDeleting}
                    title={item.isPrimary ? "Primary image" : "Set as primary image"}
                  >
                    <CheckCircle
                      className={cn(
                        "h-4 w-4 transition-colors",
                        item.isPrimary ? "text-green-400" : "text-muted-foreground",
                      )}
                    />
                  </Button>
                )}

                {/* Remove button */}
                {!item.isUploading && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 left-2"
                    onClick={() => handleRemove(index)}
                    disabled={disabled || item.isDeleting}
                  >
                    {item.isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload area */}
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
          fileItems.length > 0 ? "h-32" : "h-auto",
          className,
        )}
      >
        <div className="rounded-full bg-primary/10 p-3">
          {fileItems.length > 0 ? (
            <Plus className="h-6 w-6 text-primary" />
          ) : (
            <Upload className="h-6 w-6 text-primary" />
          )}
        </div>
        <div className="space-y-1 text-center">
          <p className="font-medium text-sm">
            {isDragging
              ? "Drop your file here"
              : fileItems.length > 0
                ? "Add more files"
                : "Drag & drop your file here"}
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
    </div>
  );
}
