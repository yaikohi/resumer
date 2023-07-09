CREATE TABLE `github_session` (
	`id` integer PRIMARY KEY NOT NULL,
	`profile_id` integer,
	`username` text,
	`name` text,
	`email` text,
	`created_at` text DEFAULT '2023-07-08T22:04:00.055Z',
	FOREIGN KEY (`profile_id`) REFERENCES `profile`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
/*
 SQLite does not support "Set default to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE profile ADD `email` text;