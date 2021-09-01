/*
  Warnings:

  - Added the required column `rate` to the `user_job_skills` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_job_skills` ADD COLUMN `rate` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `user_job_profiles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `experience_years` INTEGER NOT NULL,
    `expectedSalary` DOUBLE NOT NULL DEFAULT 0.00,
    `about` VARCHAR(191) NOT NULL,
    `skillSummary` VARCHAR(191) NOT NULL DEFAULT 'skill_summary',
    `user_id` BIGINT UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_job_profiles` ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
