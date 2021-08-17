/*
  Warnings:

  - Added the required column `uploadId` to the `DomainPitchVideo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DomainPitchVideo` ADD COLUMN `uploadId` BIGINT UNSIGNED NOT NULL;

-- AddForeignKey
ALTER TABLE `DomainPitchVideo` ADD FOREIGN KEY (`uploadId`) REFERENCES `Upload`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
