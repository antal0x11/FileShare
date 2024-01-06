const express = require('express');
const User = require('../../models/users.js');
const { isAdminAuthenticated } = require('../authentication');
const { createHash } = require('crypto');

const router = express.Router();

function alterUser(req, res, next) {
	//TODO change password and delete users
	res.status(200).send('ok');
}

router.post('/admin/alter-user', isAdminAuthenticated, alterUser);
module.exports = router;