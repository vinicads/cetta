/*
  Warnings:

  - You are about to drop the column `idGrupo` on the `contas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `contas` DROP FOREIGN KEY `contas_idGrupo_fkey`;

-- AlterTable
ALTER TABLE `contas` DROP COLUMN `idGrupo`;

-- CreateTable
CREATE TABLE `grupoConta` (
    `idGrupoConta` INTEGER NOT NULL AUTO_INCREMENT,
    `idGrupo` INTEGER NOT NULL,
    `idConta` INTEGER NOT NULL,

    PRIMARY KEY (`idGrupoConta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
