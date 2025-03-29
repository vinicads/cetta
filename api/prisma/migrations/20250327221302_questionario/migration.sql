-- AlterTable
ALTER TABLE `contas` ADD COLUMN `idQuestionario` INTEGER NULL,
    MODIFY `fagerstrom` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `questionario` (
    `idQuestionario` INTEGER NOT NULL AUTO_INCREMENT,
    `questao1` VARCHAR(45) NULL,
    `questao2` VARCHAR(45) NULL,
    `questao3` VARCHAR(45) NULL,
    `questao4` VARCHAR(45) NULL,
    `questao5` VARCHAR(45) NULL,
    `questao6` VARCHAR(45) NULL,

    PRIMARY KEY (`idQuestionario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contas` ADD CONSTRAINT `contas_idQuestionario_fkey` FOREIGN KEY (`idQuestionario`) REFERENCES `questionario`(`idQuestionario`) ON DELETE RESTRICT ON UPDATE CASCADE;
