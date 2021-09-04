/* callback = una función que se pasa como argumento de otra función 
y que será invocada. */

function sum(num1, num2) {
    return num1 + num2;
}
function calc(num1, num2, callback) {
    return callback(num1, num2)
}
console.log(calc(2, 2, sum))



/*promesa= función no bloqueante(una tarea que devuelve inmediatamente
    con indenpendencia del resultado, resultado o error) la cual puede
    retornar un valor ahora, en el futuro o nunca.*/
    
const somethingWillHappen = () => {
    return new Promise((resolve, reject) => {
        if (true) {
            resolve('Hey!');
        } else {
            reject('whoops!');
        };
    });
};

somethingWillHappen()
    .then(response => console.log (response))
    .catch(err => console.error(err));
    

    module.exports = helloWorld;