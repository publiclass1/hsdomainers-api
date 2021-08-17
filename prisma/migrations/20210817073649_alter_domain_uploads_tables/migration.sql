/*
  Warnings:

  - You are about to drop the column `uploadId` on the `domains` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `domains` DROP FOREIGN KEY `domains_ibfk_2`;

-- AlterTable
ALTER TABLE `Upload` MODIFY `userId` BIGINT UNSIGNED;

-- AlterTable
ALTER TABLE `domains` DROP COLUMN `uploadId`;

-- CreateTable
CREATE TABLE `DomainPitchVideo` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `domainId` BIGINT UNSIGNED NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DomainPitchVideo` ADD FOREIGN KEY (`domainId`) REFERENCES `domains`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
