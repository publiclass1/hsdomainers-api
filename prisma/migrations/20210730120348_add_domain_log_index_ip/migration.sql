-- AlterTable
ALTER TABLE `domains` MODIFY `dns_status` ENUM('PENDING', 'ACTIVE', 'REMOVED', 'INACTIVE', 'DNS_ERROR') NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX `ip` ON `domain_logs`(`ip`);
