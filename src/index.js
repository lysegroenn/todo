const app = require('./server');
const MongoClient = require('mongodb').MongoClient;
const postsDAO = require('./dao/postsDAO');
const usersDAO = require('./dao/usersDAO')

const port = process.env.PORT || 5000;
/*
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
}) */

/* ----- This is a different approach to initializing the 
-------- Mongo Client which I will implement in the future.
*/
MongoClient.connect(
    process.env.DB_URI,
    { useNewUrlParser: true},
)
.catch(err => {
    console.error(err.stack)
    process.exit(1)
})
.then(async client => {
    await postsDAO.injectDB(client)
    await usersDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`Listening on port ${port}`)
    }) 
}) 