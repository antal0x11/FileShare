const express = require('express');
const User = require('../../models/users.js');
const { isAdminAuthenticated } = require('../authentication');
const Logger = require('../../lib/logger');

const router = express.Router();

async function getUsers(req, res) {
	try {
		const usersFound = await User.findAll( { attributes: ['firstName', 'lastName', 'username', 'role']});
		
		res.status(200).json({ users: usersFound.map( (user) => ({
			'firstname': user.firstName,
			'lastname': user.lastName,
			'username': user.username,
			'role': user.role, 
		}))}); 
	} catch(error) {
		Logger.error({
			'description': 'Failed to fetch users',
			'path': '/admin/get_users'
		});
		res.status(500).send('<img src="img/500.png" alt="500"/>');
	}
}

router.get('/admin/get_users', isAdminAuthenticated, getUsers);
module.exports = router;