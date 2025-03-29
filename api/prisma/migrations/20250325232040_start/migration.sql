-- CreateTable
CREATE TABLE `assinatura` (
    `idAssinatura` INTEGER NOT NULL AUTO_INCREMENT,
    `codPagamento` TEXT NULL,
    `ativo` BOOLEAN NULL,
    `data_final` DATE NULL,
    `data_inicio` DATE NULL,
    `ultimo_update` DATE NULL,
    `idPlanos` INTEGER NOT NULL,

    PRIMARY KEY (`idAssinatura`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historicoPagamento` (
    `idHistoricoPagamento` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(45) NOT NULL,
    `descricao` TEXT NOT NULL,
    `valorTotal` DOUBLE NOT NULL,
    `data_inicio` DATE NULL,
    `idConta` INTEGER NOT NULL,

    PRIMARY KEY (`idHistoricoPagamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planos` (
    `idPlanos` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(45) NOT NULL,
    `descricao` TEXT NOT NULL,
    `valorTotal` DOUBLE NOT NULL,
    `tipo` ENUM('Individual', 'Grupo', 'Mentoria') NOT NULL,
    `qtdePessoas` INTEGER NOT NULL,
    `meses` INTEGER NOT NULL,
    `maxSessoes` DOUBLE NOT NULL,

    PRIMARY KEY (`idPlanos`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `autenticacao` (
    `idAutenticacao` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(80) NOT NULL,
    `idConta` INTEGER NOT NULL,

    PRIMARY KEY (`idAutenticacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contas` (
    `idConta` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(45) NOT NULL,
    `data_nasc` DATE NOT NULL,
    `foto` TEXT NULL,
    `celular` VARCHAR(15) NOT NULL,
    `perfil` ENUM('Admin', 'Usuario') NOT NULL,
    `idAssinatura` INTEGER NULL,
    `idGrupo` INTEGER NULL,

    INDEX `fk_Contas_Assinatura1_idx`(`idAssinatura`),
    PRIMARY KEY (`idConta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `geral` (
    `idGeral` INTEGER NOT NULL AUTO_INCREMENT,
    `emailContato` VARCHAR(100) NOT NULL,
    `numeroContato` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`idGeral`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupos` (
    `idGrupo` INTEGER NOT NULL AUTO_INCREMENT,
    `dataInicio` DATE NOT NULL,
    `dataFinal` DATE NOT NULL,
    `idPlanos` INTEGER NOT NULL,

    PRIMARY KEY (`idGrupo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `datas` (
    `idData` INTEGER NOT NULL AUTO_INCREMENT,
    `dia` ENUM('Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo') NOT NULL,
    `hora` VARCHAR(10) NOT NULL,
    `idGrupo` INTEGER NOT NULL,

    PRIMARY KEY (`idData`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `assinatura` ADD CONSTRAINT `assinatura_idPlanos_fkey` FOREIGN KEY (`idPlanos`) REFERENCES `planos`(`idPlanos`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historicoPagamento` ADD CONSTRAINT `historicoPagamento_idConta_fkey` FOREIGN KEY (`idConta`) REFERENCES `contas`(`idConta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `autenticacao` ADD CONSTRAINT `autenticacao_idConta_fkey` FOREIGN KEY (`idConta`) REFERENCES `contas`(`idConta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contas` ADD CONSTRAINT `contas_idGrupo_fkey` FOREIGN KEY (`idGrupo`) REFERENCES `grupos`(`idGrupo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grupos` ADD CONSTRAINT `grupos_idPlanos_fkey` FOREIGN KEY (`idPlanos`) REFERENCES `planos`(`idPlanos`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `datas` ADD CONSTRAINT `datas_idGrupo_fkey` FOREIGN KEY (`idGrupo`) REFERENCES `grupos`(`idGrupo`) ON DELETE RESTRICT ON UPDATE CASCADE;
