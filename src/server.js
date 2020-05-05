const express = require('express');
const cors = require('cors');
const posts = require('./api/posts.routes'); // Routes for posts

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use('/api/', posts);

app.listen(5000, () => console.log(`Listening on port: 5000..`));