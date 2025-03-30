/*
  Warnings:

  - You are about to drop the column `idAssinatura` on the `contas` table. All the data in the column will be lost.
  - Added the required column `idConta` to the `assinatura` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `contas` DROP FOREIGN KEY `contas_idAssinatura_fkey`;

-- AlterTable
ALTER TABLE `assinatura` ADD COLUMN `idConta` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `contas` DROP COLUMN `idAssinatura`;

-- AddForeignKey
ALTER TABLE `assinatura` ADD CONSTRAINT `assinatura_idConta_fkey` FOREIGN KEY (`idConta`) REFERENCES `contas`(`idConta`) ON DELETE RESTRICT ON UPDATE CASCADE;
