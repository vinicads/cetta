import axios from 'axios';
 
 export function MascaraCNPJ(cnpj, event){
    var novoCNPJ = cnpj;
    
    var numero = Number(event.data)
    if (!(numero >= 0)){
        if(!(event.inputType == 'deleteContentBackward')){
            return novoCNPJ.slice(0, -1);    
            }
    }

    if(event.inputType == 'deleteContentBackward'){
        if(cnpj.length == 3){
            novoCNPJ = novoCNPJ.slice(0, -1);
       }
           else if(cnpj.length == 7){
            novoCNPJ = novoCNPJ.slice(0, -1);
       }
           else if (cnpj.length == 11){
            novoCNPJ = novoCNPJ.slice(0, -1);
       }    else if (cnpj.length == 16){
        novoCNPJ = novoCNPJ.slice(0, -1);
       }   
        return novoCNPJ;
    }


    if(cnpj.length == 3 || cnpj.length == 4){
        if (cnpj.substring(2,3) != '.'){
            novoCNPJ = cnpj.substring(0, 2) + '.' + cnpj.substring(2,3);
            return novoCNPJ;
        }
   }
       else if(cnpj.length == 7 || cnpj.length == 8){
        if (cnpj.substring(6,7) != '.'){
            novoCNPJ = cnpj.substring(0, 6) + '.' + cnpj.substring(6,7);
            return novoCNPJ;
        }
   }
       else if (cnpj.length == 11 || cnpj.length == 12){
        if (cnpj.substring(10, 11) != '/'){
            novoCNPJ = cnpj.substring(0, 10) + '/' + cnpj.substring(10,11);
            return novoCNPJ;
        }
   }    else if (cnpj.length == 16 || cnpj.length == 17){
    if (cnpj.substring(15, 16) != '-'){
        novoCNPJ = cnpj.substring(0, 15) + '-' + cnpj.substring(15,16);
        return novoCNPJ;
    }
   }   

    if(cnpj.length == 2){
     novoCNPJ = cnpj +'.';
}
    else if(cnpj.length == 6){
    novoCNPJ = cnpj +'.';
}
    else if (cnpj.length == 10){
    novoCNPJ = cnpj +'/';
}    else if (cnpj.length == 15){
    novoCNPJ = cnpj +'-';
}   
    return novoCNPJ;
}

export function colarCNPJ(cnpj){
    cnpj = RemoveMascaraCNPJ(cnpj);
    const primeiraParte = cnpj.substring(0, 2);
    const segundaParte = cnpj.substring(2, 5); 
    const terceiraParte = cnpj.substring(5, 8);
    const quartaParte = cnpj.substring(8, 12);
    const quintaParte = cnpj.substring(12, 14); 
    var novoCNPJ = `${primeiraParte}.${segundaParte}.${terceiraParte}/${quartaParte}-${quintaParte}`
    return novoCNPJ; 
}

export function MascaraRG(rg, event){
    var novoRG = rg;
    
    var numero = Number(event.data)
    if (!(numero >= 0)){
        if(!(event.inputType == 'deleteContentBackward')){
            return novoRG.slice(0, -1);    
            }
    }

    if(event.inputType == 'deleteContentBackward'){
        if(rg.length == 3){
            novoRG = novoRG.slice(0, -1);
       }
           else if(rg.length == 7){
            novoRG = novoRG.slice(0, -1);
       }
           else if (rg.length == 11){
            novoRG = novoRG.slice(0, -1);
       }  
        return novoRG;
    }


    if(rg.length == 3 || rg.length == 4){
        if (rg.substring(2,3) != '.'){
            novoRG = novoRG.substring(0, 2) + '.' + novoRG.substring(2,3);
            return novoRG;
        }
   }
       else if(rg.length == 7 || rg.length == 8){
        if (rg.substring(6,7) != '.'){
            novoRG = rg.substring(0, 6) + '.' + rg.substring(6,7);
            return novoRG;
        }
   }
       else if (rg.length == 11 || rg.length == 12){
        if (rg.substring(10, 11) != '-'){
            novoRG = rg.substring(0, 10) + '-' + rg.substring(10,11);
            return novoRG;
        }
   } 

    if(rg.length == 2){
        novoRG = rg +'.';
}
    else if(rg.length == 6){
        novoRG = rg +'.';
}
    else if (rg.length == 10){
        novoRG = rg +'-';
} 
    return novoRG;
}

export function colarRG(rg){
    rg = RemoveMascaraRG(rg);
    const primeiraParte = rg.substring(0, 2);
    const segundaParte = rg.substring(2, 5); 
    const terceiraParte = rg.substring(5, 8);
    const quartaParte = rg.substring(8, 12);
    var novoRG = `${primeiraParte}.${segundaParte}.${terceiraParte}-${quartaParte}`
    return novoRG; 
}

export function MascaraCPF(cpf, event){
    var novoCPF = cpf;
    
    var numero = Number(event.data)
    if (!(numero >= 0)){
        if(!(event.inputType == 'deleteContentBackward')){
            return novoCPF.slice(0, -1);    
            }
    }

    if(event.inputType == 'deleteContentBackward'){
       
        if(cpf.length == 4){
            novoCPF = novoCPF.slice(0, -1);
       }
           else if(cpf.length == 8){
            novoCPF = novoCPF.slice(0, -1);
       }
           else if (cpf.length == 12){
            novoCPF = novoCPF.slice(0, -1);
       }  
        return novoCPF;
    }


    if(cpf.length == 4 || cpf.length == 5){
        if (cpf.substring(3,4) != '.'){
            novoCPF = cpf.substring(0, 3) + '.' + cpf.substring(3,4);
            return novoCPF;
        }
   }
       else if(cpf.length == 8 || cpf.length == 9){
        if (cpf.substring(7,8) != '.'){
            novoCPF = cpf.substring(0, 7) + '.' + cpf.substring(7,8);
            return novoCPF;
        }
   }
       else if (cpf.length == 12 || cpf.length == 13){
        if (cpf.substring(11, 12) != '-'){
            novoCPF = cpf.substring(0, 11) + '-' + cpf.substring(11,12);
            return novoCPF;
        }
   }  

 
   if(cpf.length == 3){
       novoCPF = cpf +'.';
}
   else if(cpf.length == 7){
       novoCPF = cpf +'.';
}
   else if (cpf.length == 11){
       novoCPF = cpf +'-';
}
   return novoCPF;
}

export function colarCPF(cpf){
    cpf = RemoveMascaraCPF(cpf);
    const primeiraParte = cpf.substring(0, 3);
    const segundaParte = cpf.substring(3, 6); 
    const terceiraParte = cpf.substring(6, 9);
    const quartaParte = cpf.substring(9, 11);
    var novoCPF = `${primeiraParte}.${segundaParte}.${terceiraParte}-${quartaParte}`
    return novoCPF; 
}

export async function verificaCEP(cep){
    try {
        const resposta = await axios.get(`https://cep.awesomeapi.com.br/json/${cep}`);
    if (resposta.status == 200){
        return true;
    }else{
        return false;
    }
    } catch (error) {
        return false;
    }
    
}

export async function retornaCidade(cep){
    try {
        const resposta = await axios.get(`https://cep.awesomeapi.com.br/json/${cep}`);
    if (resposta.status == 200){
        return resposta.data.city;
    }else{
        return null;
    }
    } catch (error) {
        return null;
    }
    
}

export function MascaraCEP(cep, event){
    var novoCEP = cep;

    var numero = Number(event.data)
    if (!(numero >= 0)){
        if(!(event.inputType == 'deleteContentBackward')){
            return novoCEP.slice(0, -1);    
            }
    }

    if(event.inputType == 'deleteContentBackward'){
        if(cep.length == 6){
            novoCEP = novoCEP.slice(0, -1);
       }
        return novoCEP;
    }

    if(cep.length == 6 || cep.length == 7){
        if (cep.substring(5,6) != '-'){
            novoCEP = cep.substring(0, 5) + '-' + cep.substring(5,6);
            return novoCEP;
        }
   }
 


    if(cep.length==5){
     novoCEP = cep +'-';
}
    return novoCEP;
}

export function colarCEP(cep){
    cep = RemoveMascaraCEP(cep);
    const primeiraParte = cep.substring(0, 5);
    const segundaParte = cep.substring(5, 8); 
    
    var novoCep = `${primeiraParte}-${segundaParte}`
    return novoCep; 
}

export function MascaraCelular(celular){
    var novoCelular = celular;

  
    var numero = Number(event.data)
    if (!(numero >= 0)){
        if(!(event.inputType == 'deleteContentBackward')){
            return novoCelular.slice(0, -1);    
            }
    }

    if(event.inputType == 'deleteContentBackward'){
        if(celular.length == 1){
            novoCelular = novoCelular.slice(0, -1);
       }
           else if(celular.length == 4){
            novoCelular = novoCelular.slice(0, -1);
       }
           else if (celular.length == 10){
            novoCelular = novoCelular.slice(0, -1);
       }
        return novoCelular;
    }

    if(celular.length == 1 || celular.length == 2){
        if (celular.substring(0,1) != '('){
            novoCelular = '(' + celular.substring(0,2);
            return novoCelular;
        }
   }else if(celular.length == 4 || celular.length == 5){
    if (celular.substring(3,4) != ')'){
        novoCelular = celular.substring(0,3)+ ')' + celular.substring(3,4);
        return novoCelular;
    }
}else if(celular.length == 10 || celular.length == 11){
    if (celular.substring(9,10) != '-'){
        novoCelular = celular.substring(0,9)+ '-' + celular.substring(9,10);
        return novoCelular;
    }
}

    if(celular.length == 1){
        
     novoCelular = '(' +celular;
}
    else if(celular.length == 3){
     novoCelular = celular +')';
}
    else if (celular.length == 9){
     novoCelular = celular +'-';
}  

    return novoCelular;
} 

export function colarCelular(celular){
    celular = RemoveMascaraContato(celular);
    const primeiraParte = celular.substring(0, 2);
    const segundaParte = celular.substring(2, 7);
    const terceiraParte = celular.substring(7, 11); 
    var novoCelular = `(${primeiraParte})${segundaParte}-${terceiraParte}`
    return novoCelular; 
}



export function MascaraTelefone(telefone){
    var novoTelefone = telefone;

    var numero = Number(event.data)
    if (!(numero >= 0)){
        if(!(event.inputType == 'deleteContentBackward')){
            return novoTelefone.slice(0, -1);    
            }
    }

    if(event.inputType == 'deleteContentBackward'){
        if(telefone.length == 1){
            novoTelefone = novoTelefone.slice(0, -1);
       }
           else if(telefone.length == 4){
            novoTelefone = novoTelefone.slice(0, -1);
       }
           else if (telefone.length == 9){
            novoTelefone = novoTelefone.slice(0, -1);
       }
        return novoTelefone;
    }

    if(telefone.length == 1 || telefone.length == 2){
        if (telefone.substring(0,1) != '('){
            novoTelefone = '(' + telefone.substring(0,2);
            return novoTelefone;
        }
   }else if(telefone.length == 4 || telefone.length == 5){
    if (telefone.substring(3,4) != ')'){
        novoTelefone = telefone.substring(0,3)+ ')' + telefone.substring(3,4);
        return novoTelefone;
    }
}else if(telefone.length == 9 || telefone.length == 10){
    if (telefone.substring(8,9) != '-'){
        novoTelefone = telefone.substring(0,8)+ '-' + telefone.substring(8,9);
        return novoTelefone;
    }
}

    if(telefone.length == 1){
     novoTelefone = '(' + telefone ;
}
    else if(telefone.length == 3){
    novoTelefone =  telefone +')';
}
    else if (telefone.length == 8){
    novoTelefone =  telefone +'-';
}  
return novoTelefone;
}

export function colarTelefone(telefone){
    telefone = RemoveMascaraContato(telefone);
    const primeiraParte = telefone.substring(0, 2);
    const segundaParte = telefone.substring(2, 6);
    const terceiraParte = telefone.substring(6, 10); 
    var novoTelefone = `(${primeiraParte})${segundaParte}-${terceiraParte}`
    return novoTelefone; 
}


export function RemoveMascaraCPF(cpf) {
    cpf = cpf.replaceAll(/-/g, "").replaceAll(/\./g, "")
    return cpf
}

export function RemoveMascaraRG(rg) {
    rg = rg.replaceAll(/-/g, "").replaceAll(/\./g, "")
    return rg
}
export function RemoveMascaraContato(contato) {
    contato = contato.replaceAll("-", "").replaceAll("(", "").replaceAll(")", "")
    return contato;
}

export function RemoveMascaraCNPJ(cnpj){
    cnpj = cnpj.replace(/[^\d]+/g,'');
    return cnpj;
}

export function RemoveMascaraCEP(cep){
    cep = cep.replace(/\D/g, '');
    return cep;
}

export function validarCpf(cpf){

    if (cpf != ""){
    cpf = cpf.replaceAll(/-/g, "").replaceAll(/\./g, "");
    var soma = 0

    for (var i = 0; i < 11; i++) {
    soma += Number(cpf[i]) 
    }

    var validacao
    if (soma%11 == 0){
        validacao = true
    }else{
        validacao = false
    }
    if ((cpf == '00000000000') ||(cpf == '11111111111') || (cpf == '22222222222') || (cpf == '33333333333')
    || (cpf == '44444444444') || (cpf == '55555555555') || (cpf == '66666666666') || (cpf == '77777777777')
    || (cpf == '88888888888') || (cpf == '99999999999') || (cpf.length != 11)) {
        validacao = false
    }

   return validacao;
}
}

export function validarCnpj(value){
    if (!value) return false

    const isString = typeof value === 'string'
    const validTypes = isString || Number.isInteger(value) || Array.isArray(value)
  
    if (!validTypes) return false
  
    if (isString) {

      if (value.length < 14 || value.length > 18) return false
  
      const digitsOnly = /^\d{14}$/.test(value)

      const validFormat = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/.test(value)

      const isValid = digitsOnly || validFormat
  
      if (!isValid) return false
    }
  
    const match = value.toString().match(/\d/g)
    const numbers = Array.isArray(match) ? match.map(Number) : []

    if (numbers.length !== 14) return false
    
    const items = [...new Set(numbers)]
    if (items.length === 1) return false
  
    const calc = (x) => {
      const slice = numbers.slice(0, x)
      let factor = x - 7
      let sum = 0
  
      for (let i = x; i >= 1; i--) {
        const n = slice[x - i]
        sum += n * factor--
        if (factor < 2) factor = 9
      }
  
      const result = 11 - (sum % 11)
  
      return result > 9 ? 0 : result
    }
  
    const digits = numbers.slice(12)
    
    const digit0 = calc(12)
    if (digit0 !== digits[0]) return false
  
    const digit1 = calc(13)
    return digit1 === digits[1]
}

export function fieldCollector(message){
    const matches = message.match(/\[(.*?)\]/); 
    if (matches) {
      const field = matches[1]; 
      return field;
    }
}

export function removeField(message){
    const cleanMessage = message.replace(/\[[^\]]+\]/, ''); 
    return cleanMessage;
}

export function resetFieldBorders() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      input.style.border = ''; 
    });
  }

export async function findCep(cep){
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        return response;
      } catch (error) {
        
       console.log(error);
      }
}

export function calculonasc(datanasc){
    var atual = new Date(Date.now())
    atual = atual.toLocaleDateString()
    atual = atual.replaceAll("/","")
    var diaatual = Number(atual.substring(0, 2))
    var mesatual = Number(atual.substring(2, 4))
    var anoatual = Number(atual.substring(4,8))
    var libera
    datanasc = datanasc.replaceAll("-","")
      var libera
    var anocad = Number(datanasc.substring(0, 4))
    var mescad = Number(datanasc.substring(4,6))
    var diacad = Number(datanasc.substring(6,8))


    if ((datanasc.length == 0)){
        libera = false
    }else{
        if ((anocad < anoatual)){
            libera = true   
        }else if(anocad == anoatual){

            if (mescad < mesatual){
                libera = true
            }if(mescad == mesatual){
                if (diacad <= diaatual){
                    libera = true
                }else{
                    libera = false
                }
            }if(mescad > mesatual){
                libera = false
            }
        }else if(anocad > anoatual){
            libera = false
        }

    }
    
    var contanos = anoatual - anocad
    var contameses = 0
    var contdias = 0 

    if (libera == true){
        var qtdmes
        switch(mesatual - 1){
            case 0:
              qtdmes = 31
            break
            case 1:
                if (anoatual%400 == 0){
                qtdmes = 29
                }
               else if(anoatual%4==0 && anoatual%100!=0){
               qtdmes = 29
               }
                else{
                 qtdmes = 28
                }
              
            break
            case 2:
                qtdmes =31
            break
            case 3:
                qtdmes = 30
            break
            case 4:
                qtdmes = 31
            break
            case 5:
                qtdmes = 30
            break
            case 6:
                qtdmes = 31
            break
            case 7:
                qtdmes = 31
            break
            case 8:
                qtdmes = 30
            break
            case 9:
                qtdmes =31
            break
            case 10:
                qtdmes =30
            break
            case 11:
                qtdmes =31
            break
        }


    if (mesatual > mescad){
        contdias = qtdmes + (diaatual - diacad)
        if (contdias >= qtdmes){
            contameses = mesatual - mescad  
            contdias = contdias-qtdmes
        }else{
            contameses = mesatual - mescad - 1
            contdias = qtdmes + (diaatual - diacad)
        }
    }else if (mesatual < mescad){
        contdias = qtdmes + (diaatual - diacad)
        contanos--
        contameses = (12 - (mescad - mesatual))
        if (contdias >= qtdmes){
            contdias = contdias-qtdmes
        }else{
            contdias = qtdmes + (diaatual - diacad)
        }
    }else if(mesatual = mescad){
        if (diaatual > diacad){
            contdias = diaatual - diacad
            contameses = 0 
        }else if(diaatual < diacad){
            contdias = qtdmes + (diaatual - diacad)
            contameses = 11
            contanos--
        }else if(diaatual = diacad){
            contdias = 0
            contameses = 0
        }
    }
    var con
    con = `${contanos} anos`
}
if (anocad < 1900){
    libera = false;
}
if (libera == false){
    var con 
    con = `Informe uma data válida!`


}

return con;
}

export function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
  
    return password;
  }

  export function generateRandomUser(name, cpf){
     // Remove espaços em branco e caracteres especiais do nome
  const cleanedName = name.replace(/[^a-zA-Z]/g, '');
  // Pega as primeiras 3 letras do nome (ou menos se o nome for curto)
  const usernamePrefix = cleanedName.substring(0, 3);
  // Remove quaisquer caracteres especiais e espaços do CPF
  const cleanedCPF = cpf.replace(/[^0-9]/g, '');
  // Combina as três letras do nome com o CPF
  const username = usernamePrefix + cleanedCPF;

  return username;
  }