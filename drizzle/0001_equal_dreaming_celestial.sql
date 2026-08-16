CREATE TABLE `actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`kind` varchar(80) NOT NULL,
	`status` enum('queued','in_progress','pending_approval','completed','blocked') NOT NULL DEFAULT 'queued',
	`priority` int NOT NULL DEFAULT 50,
	`dueAt` timestamp,
	`requiresApproval` boolean NOT NULL DEFAULT false,
	`sourceCitation` varchar(255),
	`completedAt` timestamp,
	CONSTRAINT `actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `approvals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` int NOT NULL,
	`actionId` int NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`rationale` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`resolvedAt` timestamp,
	CONSTRAINT `approvals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`title` varchar(255) NOT NULL,
	`caseType` varchar(100) NOT NULL,
	`summary` text NOT NULL,
	`status` enum('active','awaiting_approval','resolved','archived') NOT NULL DEFAULT 'active',
	`riskLevel` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`nextDeadline` timestamp,
	`progress` int NOT NULL DEFAULT 0,
	`isDemo` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deadlines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` int NOT NULL,
	`label` varchar(255) NOT NULL,
	`dueAt` timestamp NOT NULL,
	`status` enum('open','at_risk','met','conflicted') NOT NULL DEFAULT 'open',
	`confidence` int NOT NULL DEFAULT 90,
	`sourceCitation` varchar(255),
	`note` text,
	CONSTRAINT `deadlines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` int NOT NULL,
	`userId` int,
	`fileName` varchar(255) NOT NULL,
	`mimeType` varchar(120) NOT NULL,
	`storageKey` text NOT NULL,
	`storageUrl` text NOT NULL,
	`extractedText` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evidence_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `traceEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseId` int NOT NULL,
	`step` varchar(120) NOT NULL,
	`agent` varchar(120) NOT NULL,
	`message` text NOT NULL,
	`status` enum('running','complete','waiting','warning') NOT NULL DEFAULT 'running',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `traceEvents_id` PRIMARY KEY(`id`)
);
