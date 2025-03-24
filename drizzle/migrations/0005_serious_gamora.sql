ALTER TABLE "billboard" RENAME COLUMN "image_url" TO "image_urls";--> statement-breakpoint
ALTER TABLE "billboard" ADD COLUMN "primary_image_url" text;