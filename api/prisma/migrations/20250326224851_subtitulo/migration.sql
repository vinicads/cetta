/*
  Warnings:

  - Added the required column `subtitulo` to the `planos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `planos` ADD COLUMN `subtitulo` VARCHAR(100) NOT NULL;
