mongodb = require('mongodb');

module.exports = {
    fetchAll: (client) => (
        new Promise((resolve, reject) => {
            client.db("posts").collection("posts").find().toArray((err, data) => {
                err ? reject(err) : resolve(data);
            })
        })
    ),
    addPost: (client, title) => (
        new Promise((resolve, reject) => {
            client.db("posts").collection("posts").insertOne({title, items: [{body: "Empty item", ticked: false}]}, (err, data) => {
                err ? reject(err) : resolve(`Successfully inserted post with id ${data.insertedId}.`)
            })
        })
    ),
    removePost: (client, _id) => (
        new Promise((resolve, reject) => {
            const objId = new mongodb.ObjectID(_id);
            client.db("posts").collection("posts").removeOne({_id: objId}, (err, data) => {
                err ? reject(err) : resolve(data);
            })
        })
    )
}