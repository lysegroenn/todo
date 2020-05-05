const express = require('express');
const router = express.Router();
const postsCtrl = require('./posts.controller');
//const logger = require('../logger/logger');
//const mongo = require('./db/dbMongo');
//const GV = require('./promises/prmGetVals');

/*
router.get('/adam/', (req,res,next) => {
    res.status(200).json({msg: 'Success'})
}) */

router.route('/posts').get(postsCtrl.fetchAll)
router.route('/posts').put(postsCtrl.addPost)
router.route('/posts').delete(postsCtrl.removePost)




module.exports = router;
