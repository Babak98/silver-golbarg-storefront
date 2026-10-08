CREATE TABLE `pricing_groups` (
	`code` text PRIMARY KEY NOT NULL,
	`rate` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `products` ADD `pricing_code` text REFERENCES pricing_groups(code);--> statement-breakpoint
ALTER TABLE `products` ADD `weight_mg` integer;