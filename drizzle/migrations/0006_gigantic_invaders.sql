CREATE TABLE "Category" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"billboard_id" text NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Category" ADD CONSTRAINT "Category_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Category" ADD CONSTRAINT "Category_billboard_id_billboard_id_fk" FOREIGN KEY ("billboard_id") REFERENCES "public"."billboard"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "storeId_idx" ON "Category" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "billboardId_idx" ON "Category" USING btree ("billboard_id");