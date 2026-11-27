CREATE TABLE `service_categories` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`slug` varchar(60) NOT NULL,
	`name` json NOT NULL,
	`description` json NOT NULL,
	`active` boolean NOT NULL DEFAULT true,
	`sort` int NOT NULL DEFAULT 0,
	`created_at` datetime(3) NOT NULL,
	`updated_at` datetime(3) NOT NULL,
	CONSTRAINT `service_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `svc_cat_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`category_id` bigint unsigned NOT NULL,
	`slug` varchar(80) NOT NULL,
	`name` json NOT NULL,
	`summary` json NOT NULL,
	`features` json NOT NULL,
	`pricing` enum('fixed','quote') NOT NULL DEFAULT 'fixed',
	`price` bigint NOT NULL DEFAULT 0,
	`currency` enum('IRR','USD') NOT NULL DEFAULT 'IRR',
	`unit` json NOT NULL,
	`delivery_days` int NOT NULL DEFAULT 0,
	`highlighted` boolean NOT NULL DEFAULT false,
	`active` boolean NOT NULL DEFAULT true,
	`sort` int NOT NULL DEFAULT 0,
	`created_at` datetime(3) NOT NULL,
	`updated_at` datetime(3) NOT NULL,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `svc_slug_uq` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `order_items` MODIFY COLUMN `product_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `order_items` MODIFY COLUMN `plan_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `order_items` ADD `service_id` bigint unsigned;--> statement-breakpoint
ALTER TABLE `order_items` ADD `currency` enum('IRR','USD') DEFAULT 'IRR' NOT NULL;--> statement-breakpoint
ALTER TABLE `order_items` ADD `list_price` bigint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `order_items` ADD `exchange_rate` int;--> statement-breakpoint
ALTER TABLE `plans` ADD `currency` enum('IRR','USD') DEFAULT 'IRR' NOT NULL;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_category_id_service_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `service_categories`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `svc_cat_idx` ON `services` (`category_id`);--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_service_id_services_id_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `items_service_idx` ON `order_items` (`service_id`);--> statement-breakpoint
UPDATE `order_items` SET `list_price` = `unit_price` WHERE `list_price` = 0;
