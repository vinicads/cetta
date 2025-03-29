/*
  Warnings:

  - Added the required column `emailMedico` to the `geral` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoFuncionalidade` to the `planos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `geral` ADD COLUMN `emailMedico` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `planos` ADD COLUMN `tipoFuncionalidade` ENUM('Nutricao', 'Tabaquismo') NOT NULL;
