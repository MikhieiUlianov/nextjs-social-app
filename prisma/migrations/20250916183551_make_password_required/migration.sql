/*
  Warnings:

  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `User_password_key` ON `User`;

-- AlterTable
ALTER TABLE `User` MODIFY `password` VARCHAR(191) NOT NULL;
