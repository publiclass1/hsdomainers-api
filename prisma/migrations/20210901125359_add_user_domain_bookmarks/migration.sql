-- CreateTable
CREATE TABLE `domain_bookmarks` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `userId` BIGINT UNSIGNED NOT NULL,
    `domainId` BIGINT UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `domain_bookmarks` ADD FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `domain_bookmarks` ADD FOREIGN KEY (`domainId`) REFERENCES `domains`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
