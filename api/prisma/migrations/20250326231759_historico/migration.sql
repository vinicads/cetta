/*
  Warnings:

  - Added the required column `pago` to the `historicoPagamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `historicopagamento` ADD COLUMN `pago` BOOLEAN NOT NULL;
