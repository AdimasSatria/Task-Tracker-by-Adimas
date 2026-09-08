-- ==========================================================
-- Premium Task Tracker — MySQL Database Schema
-- Architecture: High-Performance Distributed Task Management
-- Compatible with: MySQL 8.0+ / MariaDB 10.5+
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `premium_task_tracker`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE `premium_task_tracker`;

-- Disable foreign key checks for clean teardown/setup
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `task_activities`;
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------
-- 1. Table: users
-- Purpose: Central user authentication & identity management
-- ----------------------------------------------------------
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` CHAR(36) NOT NULL UNIQUE,
    `username` VARCHAR(60) NOT NULL UNIQUE,
    `email` VARCHAR(191) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(120) NOT NULL,
    `avatar_url` VARCHAR(512) NULL,
    `role` ENUM('ADMIN', 'MEMBER', 'VIEWER') NOT NULL DEFAULT 'MEMBER',
    `theme_preference` ENUM('DARK', 'LIGHT', 'SYSTEM') NOT NULL DEFAULT 'DARK',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_uuid` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 2. Table: tasks
-- Purpose: Core task storage with prioritization & metadata
-- ----------------------------------------------------------
CREATE TABLE `tasks` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` CHAR(36) NOT NULL UNIQUE,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED') NOT NULL DEFAULT 'TODO',
    `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM',
    `category` VARCHAR(64) NOT NULL DEFAULT 'General',
    `estimated_minutes` INT UNSIGNED NOT NULL DEFAULT 30,
    `actual_minutes` INT UNSIGNED NOT NULL DEFAULT 0,
    `due_date` DATETIME NULL,
    `completed_at` DATETIME NULL,
    `is_archived` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_tasks_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_tasks_user_status` (`user_id`, `status`),
    INDEX `idx_tasks_priority` (`priority`),
    INDEX `idx_tasks_due_date` (`due_date`),
    INDEX `idx_tasks_completed_at` (`completed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 3. Table: task_activities
-- Purpose: Audit log & real-time feed stream for WebSocket sync
-- ----------------------------------------------------------
CREATE TABLE `task_activities` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `task_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `action` ENUM('CREATED', 'UPDATED', 'STATUS_CHANGED', 'COMPLETED', 'DELETED') NOT NULL,
    `previous_state` JSON NULL,
    `new_state` JSON NULL,
    `client_ip` VARCHAR(45) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_activity_task` FOREIGN KEY (`task_id`)
        REFERENCES `tasks` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_activity_user` FOREIGN KEY (`user_id`)
        REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_activities_task_created` (`task_id`, `created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Initial Seed Data (Demo Account & Apple/One UI Style Tasks)
-- ----------------------------------------------------------
INSERT INTO `users` (`id`, `uuid`, `username`, `email`, `password_hash`, `full_name`, `avatar_url`, `role`, `theme_preference`)
VALUES (
    1,
    '7f8c9d01-a1b2-4c3d-8e5f-1a2b3c4d5e6f',
    'alex.chen',
    'alex.chen@premiumtask.io',
    '$2y$12$e0MYzXyjpJS7Pd0RVvHwHeCgM3FqN8ZqL6JtW3gK7u5Q6Xy4yv7hO', -- hashed 'Password123!'
    'Alexandre Chen',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'ADMIN',
    'DARK'
);

INSERT INTO `tasks` (`id`, `uuid`, `user_id`, `title`, `description`, `status`, `priority`, `category`, `estimated_minutes`, `due_date`)
VALUES
(
    1,
    'a1111111-2222-3333-4444-555555555551',
    1,
    'Arsitektur Microservices Review',
    'Audit latency performa WebSocket Go vs API Gateway Spring Boot untuk 10k concurrent task updates.',
    'IN_PROGRESS',
    'URGENT',
    'Architecture',
    90,
    DATE_ADD(NOW(), INTERVAL 1 DAY)
),
(
    2,
    'a1111111-2222-3333-4444-555555555552',
    1,
    'Glassmorphism & Bento Grid UI Fine-Tuning',
    'Optimasi backdrop-filter CSS dan 60fps springs animation pada Samsung One UI inspired navigation pill.',
    'TODO',
    'HIGH',
    'Design System',
    60,
    DATE_ADD(NOW(), INTERVAL 2 DAY)
),
(
    3,
    'a1111111-2222-3333-4444-555555555553',
    1,
    'Python FastAPI Analytics Engine Pipeline',
    'Kalkulasi rolling 7-day velocity, burnout risk index, dan visualisasi distribusi jam produktivitas puncak.',
    'COMPLETED',
    'MEDIUM',
    'Analytics',
    45,
    DATE_SUB(NOW(), INTERVAL 3 HOUR)
),
(
    4,
    'a1111111-2222-3333-4444-555555555554',
    1,
    'Deploy Real-time WebSocket Hub (Go)',
    'Setup Redis Pub/Sub adapter untuk multi-node horizontal scaling Golang gorilla/websocket instances.',
    'TODO',
    'MEDIUM',
    'DevOps',
    120,
    DATE_ADD(NOW(), INTERVAL 4 DAY)
);
