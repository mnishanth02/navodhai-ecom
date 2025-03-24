# Cloudflare R2 File Upload Implementation

This document explains how to use the Cloudflare R2 file upload functionality implemented in this project.

## Setup

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_PUBLIC_URL=https://your-public-bucket-url.com
```

### 2. Install Required Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner uuid
```

## Usage

### Basic Usage with the FileUpload Component

```tsx
import { FileUpload } from "@/components/ui/file-upload";

export default function MyForm() {
  return (
    <div>
      <h1>Upload a file</h1>
      <FileUpload 
        folder="products" 
        onUploadComplete={(fileUrl) => {
          console.log("File uploaded:", fileUrl);
          // Update your form state with the file URL
        }}
      />
    </div>
  );
}
```

### Integration with Form Libraries (React Hook Form)

Here's how to integrate the FileUpload component with React Hook Form, as implemented in the Billboard form:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Form } from "@/components/ui/form";
import { z } from "zod";

// Define your schema
const FormSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1, "Image is required"),
});

type FormValues = z.infer<typeof FormSchema>;

export default function MyFormWithUpload() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      label: "",
      imageUrl: "",
    },
  });
  
  // Update form value when image is uploaded
  useEffect(() => {
    if (uploadedImageUrl) {
      form.setValue("imageUrl", uploadedImageUrl);
    }
  }, [uploadedImageUrl, form]);
  
  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    // Submit your form data to the server
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Image</label>
            <FileUpload
              folder="uploads"
              initialFileUrl={form.getValues().imageUrl || undefined}
              onUploadComplete={(fileUrl) => {
                setUploadedImageUrl(fileUrl);
              }}
              onUploadError={(error) => {
                console.error("Upload failed:", error);
              }}
            />
            {form.formState.errors.imageUrl && (
              <p className="text-sm text-red-500">
                {form.formState.errors.imageUrl.message}
              </p>
            )}
          </div>
          
          {/* Other form fields */}
          
          <button type="submit">Submit</button>
        </div>
      </form>
    </Form>
  );
}
```

### Using the useR2Upload Hook Directly

```tsx
import { useR2Upload } from "@/hooks/general/use-r2-upload";

export default function CustomUploader() {
  const { 
    uploadFile, 
    isUploading, 
    uploadProgress, 
    uploadedFileUrl 
  } = useR2Upload({
    folder: "avatars",
    onUploadComplete: (fileUrl) => {
      console.log("Upload complete:", fileUrl);
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {isUploading && <p>Uploading: {uploadProgress}%</p>}
      {uploadedFileUrl && <p>Uploaded to: {uploadedFileUrl}</p>}
    </div>
  );
}
```

## Architecture

The implementation consists of three main parts:

1. **R2 Client Utility** (`lib/utils/r2-client.ts`): Configures the S3 client for Cloudflare R2.

2. **Server Actions** (`data/actions/upload.actions.ts`): Provides two methods for uploading files:
   - `getPresignedUploadUrl`: Generates a presigned URL for client-side uploads
   - `uploadFileToR2`: Directly uploads a file from the server to R2

3. **Client Components**:
   - `useR2Upload` Hook: A reusable hook for handling file uploads
   - `FileUpload` Component: A UI component for file uploads with drag-and-drop support

## Features

- ✅ Direct uploads from the server
- ✅ Client-side uploads with presigned URLs
- ✅ Progress tracking
- ✅ Drag-and-drop support
- ✅ Form integration with React Hook Form
- ✅ TypeScript support with proper type definitions
- ✅ Error handling and validation
- ✅ Customizable folder structure in R2 bucket

## Real-World Implementation

The file upload functionality has been integrated into the Billboard form in the admin dashboard. This implementation demonstrates how to:

1. Use the `FileUpload` component within a form
2. Update form state when a file is uploaded
3. Handle validation and error states
4. Submit the form with the uploaded file URL

You can find the implementation in:
`app/admin/[storeId]/(routes)/billboards/[billboardId]/components/billboard-form.tsx`

## Best Practices

1. **Security**: Always validate file types and sizes both on the client and server
2. **User Experience**: Show upload progress and clear error messages
3. **Performance**: Use client-side uploads with presigned URLs for large files
4. **Organization**: Use folder parameters to organize files in your R2 bucket
5. **Error Handling**: Always handle upload errors gracefully and provide feedback to users
- ✅ Drag and drop support
- ✅ Image previews
- ✅ Error handling
- ✅ TypeScript support
- ✅ Folder organization
- ✅ Customizable UI with Shadcn UI and Tailwind CSS

## Security Considerations

- The implementation uses server actions to generate presigned URLs, ensuring that your R2 credentials are never exposed to the client.
- File type and size validation is performed both on the client and server sides.
- Consider adding additional validation for file content if needed for your use case.
