const express = require('express');
const router = express.Router();
const usersCtrl = require('./users.controller');


router.route('/register').post(usersCtrl.register)
router.route('/login').post(usersCtrl.login)
router.route('/logout').post(usersCtrl.logout)
router.route('/status').get(usersCtrl.getLoginStatus)



module.exports = router;
