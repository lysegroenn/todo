const app = require('./server');
const MongoClient = require('mongodb').MongoClient;
const postsDAO = require('./dao/postsDAO');

const port = process.env.PORT || 5000;

MongoClient.connect(
    process.env.DB_URI,
    { useNewUrlParser: true},
)
.catch(err => {
    console.error(err.stack)
    process.exit(1)
})
.then(async client => {
    posts = await postsDAO.fetchAll(client)
    console.log(posts)
    app.listen(port, () => {
        console.log(`Listening on port ${port}`)
    }) 
})