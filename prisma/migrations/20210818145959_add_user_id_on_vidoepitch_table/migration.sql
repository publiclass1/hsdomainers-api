/*
  Warnings:

  - Added the required column `userId` to the `DomainPitchVideo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DomainPitchVideo` ADD COLUMN `userId` BIGINT UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `DomainPitchVideo` ADD FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
