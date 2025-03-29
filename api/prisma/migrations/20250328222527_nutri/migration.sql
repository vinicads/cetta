-- AlterTable
ALTER TABLE `contas` MODIFY `perfil` ENUM('Admin', 'Usuario', 'Nutricionista') NOT NULL;
