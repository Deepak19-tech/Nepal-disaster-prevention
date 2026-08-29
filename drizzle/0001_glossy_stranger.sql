CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(32) NOT NULL,
	`title` varchar(220) NOT NULL,
	`body` text NOT NULL,
	`disasterType` varchar(64) NOT NULL,
	`severity` enum('info','action','urgent','critical') NOT NULL,
	`affectedAreas` text NOT NULL,
	`recommendedActions` text NOT NULL,
	`status` enum('draft','published','resolved') NOT NULL DEFAULT 'draft',
	`publishedBy` int,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`),
	CONSTRAINT `alerts_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `districts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`province` varchar(120) NOT NULL,
	`riskScore` int NOT NULL DEFAULT 0,
	`riskLevel` enum('stable','watch','elevated','high') NOT NULL DEFAULT 'stable',
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `districts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emergencyContacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`label` varchar(120) NOT NULL,
	`number` varchar(32) NOT NULL,
	`description` varchar(180) NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emergencyContacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `externalDataSnapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`source` varchar(120) NOT NULL,
	`category` varchar(64) NOT NULL,
	`payload` text NOT NULL,
	`observedAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `externalDataSnapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `incidents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporterId` int NOT NULL,
	`disasterType` varchar(64) NOT NULL,
	`location` varchar(240) NOT NULL,
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`severity` enum('moderate','high','critical') NOT NULL,
	`description` text NOT NULL,
	`contactDetails` varchar(160),
	`status` enum('submitted','reviewing','verified','resolved','rejected') NOT NULL DEFAULT 'submitted',
	`reviewedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `incidents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`body` text NOT NULL,
	`kind` varchar(64) NOT NULL,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `preparednessResources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(180) NOT NULL,
	`disasterType` varchar(64) NOT NULL,
	`summary` text NOT NULL,
	`body` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `preparednessResources_id` PRIMARY KEY(`id`)
);
