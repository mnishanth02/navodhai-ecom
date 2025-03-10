"use client";

import { useState } from "react";
import { FileUpload } from "@/components/common/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function R2UploadExample() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!fileUrl) {
      toast.error("Please upload a file");
      return;
    }
    
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    
    // Here you would typically submit the form data to your backend
    toast.success("Form submitted successfully!");
    console.log({ name, fileUrl });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Example</CardTitle>
        <CardDescription>
          Upload a file to Cloudflare R2 storage
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter a name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>File</Label>
            <FileUpload
              folder="examples"
              onUploadComplete={(url) => {
                setFileUrl(url);
                toast.success("File uploaded successfully!");
              }}
              onUploadError={(error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
            />
          </div>
          
          {fileUrl && (
            <div className="text-sm text-muted-foreground break-all">
              <p>File URL: {fileUrl}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
