const express = require('express');
const cors = require('cors');
const posts = require('./api/posts.routes'); // Routes for posts
const users = require('./api/users.routes'); // Routes for users

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.disable('x-powered-by')
app.use(cors());


//Api routes
app.use('/api/posts', posts);
app.use('/api/users', users);

module.exports = app;