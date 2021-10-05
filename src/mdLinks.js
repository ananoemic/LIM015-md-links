const fs = require('fs');
const api = require("./api.js");

const getStats = (array) => {                                                               //función para obtener las estadísticas 
    const totalUrls = array.length;                                                         //cuantós objetos hay 
    const uniqueUrls = new Set(array.map(url=>url.href));                                   //creo un nuevo set de todos los urls encontrados
    const stat = `Total: ${totalUrls}\nUnique: ${uniqueUrls.size}\n`;                       //.size devolverá el número de valores únicos
    return stat;
  }

const mdLinks = (path, options) => {                                                        //se crea promesa MdLinks, con 2 parámetros para la dir del file y la option que quiero que ejecute
    return new Promise( (resolve, reject) => {
        console.log('\x1b[36m','Iniciando...');     
        if(fs.existsSync(path)){                                                             //se validará primero que nada si existe la dirección ingresada
            const dirAbsolute = api.pathAbsolute(path);                                 
            console.log('\x1b[34m','Analizando: '+ dirAbsolute);
            const arrFilesMd = api.listFiles(dirAbsolute);                                  //almaceno el variables la información que llamaré luego
            const validateFalse = api.extractInfo(arrFilesMd);
            const validateTrue= api.getStatusLinks(arrFilesMd);
            const stat = getStats(validateFalse);
            switch(options){                                                                //la expresión -options- se refiere al 2° parámetro
                case (options=undefined):
                    resolve(validateFalse);                                                 //devolverá validateFalse si no se ingresó el 2°par
                    break;
                case ('--validate'):
                    resolve(validateTrue);                                                   //devolverá validateTrue si se ingresó "validate"
                    break;
                case('--stats'):
                    resolve(stat);
                    break;
                case('--stats--validate'):                                                     //en caso se haya ingresado dos opciones 
                    console.log('\x1b[37m',stat);                                               //imprimirá el stat 
                    console.log('\x1b[34m','Ya casi terminamos... ')
                    resolve(validateTrue);                                                    //tambien devolverá validateTrue
                    break;
                case('--validate--stats'):
                    console.log('\x1b[37m',stat);
                    console.log('\x1b[34m','Ya casi terminamos... ')
                    resolve(validateTrue);
                    break;
                default: reject("Esta opción no es válida.")
            }
        }else{
            reject('Lo sentimos, error ingresando ruta.');                                                  //entregará error en caso no haya dirección válida
        }
    })
 }
 
module.exports = {
    mdLinks
}