-- CreateTable
CREATE TABLE `assinatura` (
    `idAssinatura` INTEGER NOT NULL AUTO_INCREMENT,
    `codPagamento` TEXT NULL,
    `ativo` BOOLEAN NULL,
    `data_inicio` DATE NULL,
    `ultimo_update` DATE NULL,
    `idPlanos` INTEGER NOT NULL,
    `idConta` INTEGER NOT NULL,

    PRIMARY KEY (`idAssinatura`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historicoPagamento` (
    `idHistoricoPagamento` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(45) NOT NULL,
    `descricao` TEXT NOT NULL,
    `pago` BOOLEAN NOT NULL,
    `valorTotal` DOUBLE NOT NULL,
    `data_inicio` DATE NULL,
    `idConta` INTEGER NOT NULL,

    PRIMARY KEY (`idHistoricoPagamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planos` (
    `idPlanos` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(45) NOT NULL,
    `subtitulo` VARCHAR(100) NOT NULL,
    `descricao` TEXT NOT NULL,
    `valorTotal` DOUBLE NOT NULL,
    `tipoFuncionalidade` ENUM('Nutricao', 'Tabaquismo') NOT NULL,
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
    `fagerstrom` BOOLEAN NOT NULL DEFAULT false,
    `perfil` ENUM('Admin', 'Usuario', 'Nutricionista') NOT NULL,
    `idQuestionario` INTEGER NULL,

    PRIMARY KEY (`idConta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `geral` (
    `idGeral` INTEGER NOT NULL AUTO_INCREMENT,
    `emailContato` VARCHAR(100) NOT NULL,
    `emailMedico` VARCHAR(100) NOT NULL,
    `numeroContato` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`idGeral`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupos` (
    `idGrupo` INTEGER NOT NULL AUTO_INCREMENT,
    `dataInicio` DATE NOT NULL,
    `dataFinal` DATE NOT NULL,
    `link` TEXT NULL,
    `idPlanos` INTEGER NOT NULL,

    PRIMARY KEY (`idGrupo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupoConta` (
    `idGrupoConta` INTEGER NOT NULL AUTO_INCREMENT,
    `idGrupo` INTEGER NOT NULL,
    `idConta` INTEGER NOT NULL,

    PRIMARY KEY (`idGrupoConta`)
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
ALTER TABLE `assinatura` ADD CONSTRAINT `assinatura_idConta_fkey` FOREIGN KEY (`idConta`) REFERENCES `contas`(`idConta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historicoPagamento` ADD CONSTRAINT `historicoPagamento_idConta_fkey` FOREIGN KEY (`idConta`) REFERENCES `contas`(`idConta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `autenticacao` ADD CONSTRAINT `autenticacao_idConta_fkey` FOREIGN KEY (`idConta`) REFERENCES `contas`(`idConta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contas` ADD CONSTRAINT `contas_idQuestionario_fkey` FOREIGN KEY (`idQuestionario`) REFERENCES `questionario`(`idQuestionario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grupos` ADD CONSTRAINT `grupos_idPlanos_fkey` FOREIGN KEY (`idPlanos`) REFERENCES `planos`(`idPlanos`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `datas` ADD CONSTRAINT `datas_idGrupo_fkey` FOREIGN KEY (`idGrupo`) REFERENCES `grupos`(`idGrupo`) ON DELETE RESTRICT ON UPDATE CASCADE;
