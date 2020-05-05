const url = "mongodb+srv://todo-user:deathwing00@todos-buwxe.mongodb.net/test?retryWrites=true&w=majority"
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dotenv = require('dotenv');

dotenv.config({path: '../../config/config.env'});
const uri = process.env.MONGO_URI;

module.exports = {

    /*
    *
    Utility: Connect to Database */
    connect: async () => (
        client = await (() => (new Promise((resolve, reject) => (

            MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {
                //assert.equal(null, err);  // error handled by try/catch block 
                err ? reject(err) : null;  // error handled by .catch method in Promise-chain
                resolve(client);
            })

        )     
)))()),

    /*
    *
    Utility: Close connection */
    close: async (client) => {
            client.close();
            return true;
    },
    conn: () => (
        new Promise((resolve, reject) => {
            MongoClient.connect(uri, (err, client) => {
                err ? reject(err) : resolve(client);
            })
        })
    )
}