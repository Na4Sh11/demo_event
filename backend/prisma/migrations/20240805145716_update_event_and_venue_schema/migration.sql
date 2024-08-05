/*
  Warnings:

  - The primary key for the `events` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `no_of_tickets` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `ticket_price` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `tickets_sold` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `events` table. All the data in the column will be lost.
  - Added the required column `classifications` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `images` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localDate` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `locale` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salesEnd` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salesStart` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusCode` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timezone` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venueId` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `events` DROP FOREIGN KEY `events_postedById_fkey`;

-- DropForeignKey
ALTER TABLE `user_events` DROP FOREIGN KEY `user_events_event_id_fkey`;

-- AlterTable
ALTER TABLE `events` DROP PRIMARY KEY,
    DROP COLUMN `date`,
    DROP COLUMN `description`,
    DROP COLUMN `location`,
    DROP COLUMN `no_of_tickets`,
    DROP COLUMN `ticket_price`,
    DROP COLUMN `tickets_sold`,
    DROP COLUMN `title`,
    ADD COLUMN `classifications` JSON NOT NULL,
    ADD COLUMN `images` JSON NOT NULL,
    ADD COLUMN `localDate` DATETIME(3) NOT NULL,
    ADD COLUMN `locale` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `salesEnd` DATETIME(3) NOT NULL,
    ADD COLUMN `salesStart` DATETIME(3) NOT NULL,
    ADD COLUMN `statusCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `timezone` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL,
    ADD COLUMN `url` VARCHAR(191) NOT NULL,
    ADD COLUMN `venueId` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `postedById` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user_events` MODIFY `event_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `venues` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `timezone` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `location` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `venues`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events` ADD CONSTRAINT `events_postedById_fkey` FOREIGN KEY (`postedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_events` ADD CONSTRAINT `user_events_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
