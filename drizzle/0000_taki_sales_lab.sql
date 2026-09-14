CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`team` text DEFAULT 'Sales' NOT NULL,
	`role` text DEFAULT 'sale' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
--> statement-breakpoint
CREATE TABLE `training_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_id` text NOT NULL,
	`scenario_id` text NOT NULL,
	`score` integer NOT NULL,
	`turns` integer NOT NULL,
	`metrics_json` text NOT NULL,
	`transcript_json` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `training_sessions_user_created_idx` ON `training_sessions` (`user_id`,`created_at`);
--> statement-breakpoint
CREATE INDEX `training_sessions_created_idx` ON `training_sessions` (`created_at`);
