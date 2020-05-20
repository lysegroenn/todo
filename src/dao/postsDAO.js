mongodb = require('mongodb');

let posts
let userPosts

module.exports = {
    injectDB: async (client) => {
        if (posts && userPosts) {
            return
        }
        try {
            console.log('injecting db')
            posts = await client.db("posts").collection("posts");
            userPosts = await client.db("posts").collection("userPosts");
        } catch(e) {
            console.log(`Error connecting to database: ${e}`)
        }
    },
    fetchAll: (client) => (
        new Promise((resolve, reject) => {
            posts.find().toArray((err, data) => {
                err ? reject(err) : resolve(data);
            })
        })
    ),
    /**
    @param {string} title - Title for the new post
    */
    addPost: (title) => (
        new Promise((resolve, reject) => {
            posts.insertOne({title, items: [{body: "Empty item", ticked: false}]}, (err, data) => {
                err ? reject(err) : resolve(`Successfully inserted post with id ${data.insertedId}.`)
            })
        })
    ),
    removePost: (_id) => (
        new Promise((resolve, reject) => {
            const objId = new mongodb.ObjectID(_id);
            posts.removeOne({_id: objId}, (err, data) => {
                err ? reject(err) : resolve(data);
            })
        })
    ),
    addSub: (_id) => (
        new Promise((resolve, reject) => {
            !_id ? reject("No ID in request") : null;
            posts
            .updateOne({_id: new mongodb.ObjectID(_id)}, {$push :{items: {body: "Empty Item", ticked: false}}}, (err, data) => {
                err ? reject(err) : resolve(data);
            })
        })
    ),
    removeSub: (_id, ind) => (
        new Promise((resolve, reject) => {
            !_id || !ind ? reject("Incorrect Params") : null;

            const ID = new mongodb.ObjectID(_id);
            posts.findOne({_id: ID}, (err, data) => {
                let newArray = data.items.filter((sub, index) => index !== ind);
                console.log(newArray)
                err ? reject(err) : posts.updateOne({_id: ID}, {$set: {items: newArray}}, (err, data) => {
                    err ? reject(err) : resolve(data);
                })
            })
        })
    ),
    getUserPosts: (user) => (
        new Promise((resolve, reject) => {
            const user_id = user.email //change to destructuring: const { email } = user
            userPosts.find({user_id: user_id}, (err, data) => {
                err ? reject(err) : resolve(data.toArray())
            })        
        })
    ),
    addUserPost: (user, title) => (
        new Promise((resolve, reject) => {
            const user_id = user.email //change to destructuring const { email } = user
            userPosts.insertOne({user_id: user_id, title: title, items: [{body: "Empty item", ticked: false}]}, (err, data) => {
                err ? reject(err) : resolve(data)
            })
        })
    )
}