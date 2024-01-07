const express = require('express');
const User = require('../../models/users.js');
const { isAdminAuthenticated } = require('../authentication');
const { createHash } = require('crypto');
const fs = require('fs');
const path = require('path');

const router = express.Router();

function validateUser(req, res, next) {
	//TODO validate req.body

	if (req.body) {
		if (req.body.firstname && req.body.lastname && req.body.username && req.body.password) {
			next();
		} else {
			res.status(400).redirect('/admin/dashboard');
		}
	} else {
		res.status(400).redirect('/admin/dashboard');
	}
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

			const { id } = await User.findOne( { where: 
				{
					'firstName': req.body.firstname,
					'lastName': req.body.lastname,
					'username': req.body.username
				}
			});
			
			const userDirectory = path.join(__dirname, '..', '..', 'uploads', id);

			fs.mkdirSync(userDirectory);

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

			const { id } = await User.findOne( { where: 
				{
					'firstName': req.body.firstname,
					'lastName': req.body.lastname,
					'username': req.body.username
				}
			});
			
			const userDirectory = path.join(__dirname, '..', '..', 'uploads', id);

			fs.mkdirSync(userDirectory);
			
			res.status(200).redirect('/admin/dashboard');
		} catch(error) {
			res.status(500).redirect('/admin/dashboard');
		}
		break;
	}	
	
}

router.post('/admin/create-user', isAdminAuthenticated, express.urlencoded( { extended: false }), createUser);
module.exports = router;