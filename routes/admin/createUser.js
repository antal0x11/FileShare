const express = require('express');
const User = require('../../models/users.js');
const { isAdminAuthenticated } = require('../authentication');
const { createHash } = require('crypto');

const router = express.Router();

function validateUser(req, res, next) {
	//TODO validate req.body
	next();
}

async function createUser(req, res, next) {

	switch(req.body.role) {
	case 'admin':
		try {
			await User.create({ 
				'firstName': req.body.firstname,
				'lastName': req.body.lastname,
				'username': req.body.username,
				'password': createHash('sha256').update(req.body.password).digest('hex'),
				'role': req.body.role
			});
			res.status(200).redirect('/admin/dashboard');
		} catch(error) {
			res.status(500).redirect('/admin/dashboard');
		}
		break;
	default:
		try {
			await User.create({ 
				'firstName': req.body.firstname,
				'lastName': req.body.lastname,
				'username': req.body.username,
				'password': createHash('sha256').update(req.body.password).digest('hex'),
				'role': 'user'
			});
			res.status(200).redirect('/admin/dashboard');
		} catch(error) {
			res.status(500).redirect('/admin/dashboard');
		}
		break;
	}	
	
}

router.post('/admin/create-user', isAdminAuthenticated, express.urlencoded( { extended: false }), createUser);
module.exports = router;