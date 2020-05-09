mongodb = require('mongodb');

module.exports = {
    fetchAll: (client) => (
        new Promise((resolve, reject) => {
            client.db("posts").collection("posts").find().toArray((err, data) => {
                err ? reject(err) : resolve(data);
            })
        })
    ),
    /**
    @param {string} title - Title for the new post
    */
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
    ),
    addSub: (client, _id) => (
        new Promise((resolve, reject) => {
            !_id ? reject("No ID in request") : null;
            client.db("posts").collection("posts")
            .updateOne({_id: new mongodb.ObjectID(_id)}, {$push :{items: {body: "Empty Item", ticked: false}}}, (err, data) => {
                err ? reject(err) : resolve(data);
            })
        })
    ),
    removeSub: (client, _id, ind) => (
        new Promise((resolve, reject) => {
            !_id || !ind ? reject("Incorrect Params") : null;

            const ID = new mongodb.ObjectID(_id);
            client.db("posts").collection("posts").findOne({_id: ID}, (err, data) => {
                let newArray = data.items.filter((sub, index) => index !== ind);
                console.log(newArray)
                err ? reject(err) : client.db("posts").collection("posts").updateOne({_id: ID}, {$set: {items: newArray}}, (err, data) => {
                    err ? reject(err) : resolve(data);
                })
            })
        })
    )
}