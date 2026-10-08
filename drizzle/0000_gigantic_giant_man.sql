CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`price` integer,
	`weight` text NOT NULL,
	`image` text NOT NULL,
	`created` integer NOT NULL
);
