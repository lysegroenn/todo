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
    getUserPosts: (user) => (
        new Promise((resolve, reject) => {
            const { email } = user 
            userPosts.find({user_id: email}, (err, data) => {
                err ? reject(err) : resolve(data.toArray())
            })        
        })
    ),
    addUserPost: (user, title) => (
        new Promise((resolve, reject) => {
            const { email } = user 
            userPosts.insertOne({user_id: email, title: title, items: [{body: "Empty item", ticked: false}]}, (err, data) => {
                err ? reject(err) : resolve(data)
            })
        })
    ),
    removeUserPost: (user, _id) => (
        new Promise((resolve, reject) => {
            const { email } = user 
            userPosts.deleteOne({user_id: email, _id: new mongodb.ObjectID(_id)}, (err, data) => {
                err ? reject(err) : resolve(data)
            })
        })
    ),
    addUserSub: (user, _id) => (
        new Promise((resolve, reject) => {
            userPosts.updateOne({_id: new mongodb.ObjectID(_id), user_id: user.email}, {$push: {items: {body: "Empty Item", ticked: false}}}, (err, data) => {
                err ? reject(err) : resolve(data)
            })
        })
    ),
    removeUserSub: (_id, ind) => (
        new Promise((resolve, reject) => {
            const ID = new mongodb.ObjectID(_id)
            userPosts.findOne({_id: ID}, (err, data) => {
                let newArray = data.items.filter((sub, index) => index !== ind)
                err ? reject(err) : userPosts.updateOne({_id: ID}, {$set : {items: newArray}}, (err, data) => {
                    err ? reject(err) : resolve(data)
                })
            })
        })
    )
}