CREATE TABLE "billboard" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"label" text NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "billboard" ADD CONSTRAINT "billboard_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "store_id_idx" ON "billboard" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "store_name_idx" ON "store" USING btree ("name");