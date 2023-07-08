CREATE TABLE `profile` (
	`id` integer PRIMARY KEY NOT NULL,
	`username` text,
	`name` text,
	`created_at` text DEFAULT '2023-07-08T21:30:55.242Z'
);
--> statement-breakpoint
CREATE TABLE `resume` (
	`id` integer PRIMARY KEY NOT NULL,
	`profile_id` integer,
	`content` text NOT NULL,
	`created_at` text DEFAULT '2023-07-08T21:30:55.243Z',
	FOREIGN KEY (`profile_id`) REFERENCES `profile`(`id`) ON UPDATE no action ON DELETE no action
);
