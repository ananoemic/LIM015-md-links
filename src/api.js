const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const userPath = process.argv[2];                                           // process.argv es una matriz que contiene argumentos de la línea de comandos. El primer elemento serpa el "nodo", el 2do será el nobre del archivo JS. 


//-----función que ingresa a la dirección entregada y evalúa y lo entrega en absoluta--

const pathAbsolute = filePath => {
  if(path.isAbsolute(filePath) === false){                                 //verifica si es relativa
  return path.resolve(filePath);                                          //convierte de relativa a absoluta
  } else {
    return filePath;                                                         ///// ABSOLUTE = especifica
  }                                                                         ///// C:\Users\Ana\bootcamp\LIM015-mdLinks\LIM015-md-links\package.json         
}                                                                          /////RELATIVE = general                                                                          ////package.json               


//------función que ingresa a la dirección y a todas sus subcarpetas para extraer los archivos .md------//
const listFiles = (dir) => {                                      
  const statF = fs.statSync(dir);                                            //método de file system para obtener info del path para saber si es file o directory
  let array = [];                                                            //array donde almacenaré todos los files
  if (statF.isDirectory()) {                                                 // condición 1 para ver si es directorio lo que ingreso
    let filesDir = fs.readdirSync(dir);                                      //obtengo la lista de files del directorio
    let filesDirExt = filesDir.map(e => path.join(dir, e));                  //path.join me ayuda a juntar dir + e y entrega la dirección completa
    filesDirExt.forEach((l)=>{                                               //recorro cada elemento del array con forEach 
      if(fs.lstatSync(l).isFile()){                                          // si el elemento es file, lo ingreso al array creado para almacenar los files
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
  let listMd = array.filter( e => path.extname(e) === '.md')
  return listMd;                                                             //retorna el array donde se ha estado agregando todos los files md
}                                                                            //solo los files .md


//------función que ingresa cada achivo md del array para extraer urls e info acerca del url------validateFalse------//
const extractInfo = (arrayFilesMd) => {     
  const regExLinkTextUrl = /\[(.+)\]\((https?:\/\/[^\s]+)(?: "(.+)")?\)|(https?:\/\/[^\s]+)/ig;        //Expresiones regulares(RegExp) son un sistema para buscar, capturar o reemplazar texto utilizando PATRONES                    
  const regExText = /\[([^\]]+)]/g;
  const regExUrl = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
  let objectUrl = [];
  
  arrayFilesMd.forEach( pathMd => {                                             //recorro cada file md 
    const textMd  = fs.readFileSync(pathMd, {encoding: 'utf8'})                 //accedo al texto de cada file, el método readFile me ayuda a extrae la data de un texto plano
    const arrLinks = textMd.match(regExLinkTextUrl);                            //busco con patrones los urls y su texto y se ingresan como arrays                 
    arrLinks.forEach( textLink => {                                             //recorrerá cada arrays de links encontrados con sus textos
      objectUrl.push({                                                          //añadirá un objeto por cada url encontrado
        'href': textLink.match(regExUrl).toString(),                             //se contruye un array de objetos 
        'text': (textLink.match(regExText) !== null) ?  textLink.match(regExText).toString().slice(1,-1) : "No se encontró referencia.",
        'file': pathMd
      })
    })
    
  });
  return objectUrl;
}

//------función que recorre cada objecto que tiene info de cada url independiente y extrae el status del url agregándolo al objeto---validateTrue--//
const getStatusLinks = arrayObjects=>{
  const getStatus = extractInfo(arrayObjects);
  const arrayPromises = getStatus.map(object => {                                   //uso -map- pues quiero crear un nuevo array, no modificar el que ya tengo
    return fetch(object.href)                                                        //el api FETCH me ayuda a acceder al canal HTTP, y poder hacer una petición de la url(href)
    .then(response => {                                                          //fetch devuelve una promesa así que uso then y catch           
      const statusText = response.status === 200 ? response.statusText : "FAIL"
      const responseObject = {
        ...object,                                                                   //si la respuesta es positiva, se ingresará el status: ok
        status: response.status,
        message: statusText
      }
      return responseObject
    })
    .catch(rej=>{
      const rejectObject = {
        ...object,
        'status': rej.status!== undefined ? rej.status: "Desconocido",                                                       //si la respuesta es negativa, será fail
        'message': 'FAIL'
      }
      return rejectObject
    })
  })
   return Promise.all(arrayPromises)                               //*promesa= función no bloqueante(una tarea que devuelve inmediatamente
  // .then (resp => console.log(resp))                               // con indenpendencia del resultado, resultado o error) la 
  // .catch(error=> console.log(error))                               //retornar un valor ahora, en el futuro o nunca.*/
}

module.exports = {
  pathAbsolute,
  listFiles,
  extractInfo,
  getStatusLinks
}