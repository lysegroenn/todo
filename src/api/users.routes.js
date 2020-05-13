const express = require('express');
const router = express.Router();
const usersCtrl = require('./users.controller');


router.route('/register').post(usersCtrl.register)



module.exports = router;
