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

router.route('/userPosts').get(postsCtrl.getUserPosts)
router.route('/userPosts').post(postsCtrl.addUserPost)
router.route('/userPosts').delete(postsCtrl.removeUserPost)
router.route('/userSub').post(postsCtrl.addUserSub)
router.route('/userSub').delete(postsCtrl.removeUserSub)





module.exports = router;
