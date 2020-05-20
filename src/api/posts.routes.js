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

router.route('/').get(postsCtrl.fetchAll)
router.route('/').put(postsCtrl.addPost)
router.route('/').delete(postsCtrl.removePost)
router.route('/sub').put(postsCtrl.addSub)
router.route('/sub').delete(postsCtrl.removeSub)
router.route('/userPosts').get(postsCtrl.getUserPosts)
router.route('/userPosts').post(postsCtrl.addUserPost)





module.exports = router;
