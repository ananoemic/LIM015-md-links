const fs = require('fs');
const path = require('path');
const userPath = process.argv[2];

const existNabsolute = filePath => {
 if (fs.existsSync(filePath) === false ){                                    //comprueba que existe
   throw "End. This file does not exit";
 } else {
   if(path.isAbsolute(filePath) === false){                                 //verifica si es relativa
    return path.resolve(filePath);                                           //convierte de relativa a absoluta
   } else {
    return filePath;                                                         // ABSOLUTE = especifica
   }                                                                         // C:\Users\Ana\bootcamp\LIM015-mdLinks\LIM015-md-links\package.json         
  }                                                                          //RELATIVE = general
};                                                                           //package.json               
const pathAbsolute = existNabsolute(userPath);                               //EXISTE Y ES ABSOLUTA****
//console.log(pathAbsolute);

const listFiles = (dir) => {                                      
  const statF = fs.statSync(dir);                                           //parámetro de file system para obtener info del link para saber si es file o directory
  let array = [];                                                           //array donde almacenaré todos los files
  if (statF.isDirectory()) {                                                // condición 1 para ver si es directorio lo que ingreso
    let filesDir = fs.readdirSync(dir);                                     //obtengo la lista de files del directorio
    let filesDirExt = filesDir.map(e => path.join(dir, e));                 //path.join me ayuda a juntar dir + e y entrega la dirección completa
    filesDirExt.forEach((l)=>{                                              //recorro cada elemento del array con forEach 
      if(fs.lstatSync(l).isFile()){                                         // si el elemento es file, lo ingreso al array creado para almacenar los files
        array.push(l);
      }else{
        let endList = listFiles(l);                                          //si no es file, empezará el ciclo nuevamente
        array = array.concat(endList);                                       //el resultado de la función inicial se concatena a la array ya creada
      }
    })} else if (statF.isFile()) {                                           // condición 2, en caso la dirección ingresada sea file
    array.push(dir.toString());
  }else{
    throw "Undertermined path"                                               // para errores que no sean file ni directorio
  }
  return array;                                                              //retorna el array donde se ha estado agregando todos los files
}

const arrayFiles = listFiles(pathAbsolute);                                  
console.log(arrayFiles);