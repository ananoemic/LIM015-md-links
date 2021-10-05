const {mdLinks} = require("./mdLinks.js")
const userPath = process.argv[2];
const option = process.argv[3]; 


mdLinks(userPath,option)
.then((res) => {console.log('\x1b[37m', res)})
.catch((err) => {console.log("\x1b[36m'", err)})
