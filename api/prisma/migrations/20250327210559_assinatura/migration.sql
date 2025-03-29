-- AddForeignKey
ALTER TABLE `contas` ADD CONSTRAINT `contas_idAssinatura_fkey` FOREIGN KEY (`idAssinatura`) REFERENCES `assinatura`(`idAssinatura`) ON DELETE RESTRICT ON UPDATE CASCADE;
