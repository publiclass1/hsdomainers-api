-- AlterTable
ALTER TABLE `users` ADD COLUMN `user_type` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER';
