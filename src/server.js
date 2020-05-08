const express = require('express');
const cors = require('cors');
const posts = require('./api/posts.routes'); // Routes for posts

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


//Api routes
app.use('/api/', posts);

module.exports = app;