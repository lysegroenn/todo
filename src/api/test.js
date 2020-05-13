const userController = require('./users.controller')

const testUser = {name: 'adam', email: 'adamliden@hotmail.com', password: 'pwpw123'}

const adam = new userController.User(testUser);

let jwt = adam.encoded()

console.log(jwt)

adam.decoded(jwt).then(res => console.log(res))


