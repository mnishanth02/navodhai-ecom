CREATE TABLE "color" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Size" RENAME TO "size";--> statement-breakpoint
ALTER TABLE "size" DROP CONSTRAINT "Size_store_id_store_id_fk";
--> statement-breakpoint
DROP INDEX "name_idx";--> statement-breakpoint
ALTER TABLE "color" ADD CONSTRAINT "color_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "color_storeId_idx" ON "color" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "color_name_idx" ON "color" USING btree ("name");--> statement-breakpoint
ALTER TABLE "size" ADD CONSTRAINT "size_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "size_name_idx" ON "size" USING btree ("name");