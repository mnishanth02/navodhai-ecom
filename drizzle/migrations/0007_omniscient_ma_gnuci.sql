ALTER TABLE "Category" RENAME TO "category";--> statement-breakpoint
ALTER TABLE "category" DROP CONSTRAINT "Category_store_id_store_id_fk";
--> statement-breakpoint
ALTER TABLE "category" DROP CONSTRAINT "Category_billboard_id_billboard_id_fk";
--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_billboard_id_billboard_id_fk" FOREIGN KEY ("billboard_id") REFERENCES "public"."billboard"("id") ON DELETE no action ON UPDATE no action;