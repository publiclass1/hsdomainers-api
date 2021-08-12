/*
  Warnings:

  - You are about to alter the column `type` on the `Upload` table. The data in that column could be lost. The data in that column will be cast from `Enum("Upload_type")` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Upload` MODIFY `type` VARCHAR(191);
