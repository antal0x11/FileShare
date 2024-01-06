const express = require('express');
const User = require('../../models/users.js');
const { isAdminAuthenticated } = require('../authentication');

const router = express.Router();

async function getUsers(req, res, next) {
	try {
		const usersFound = await User.findAll( { attributes: ['firstName', 'lastName', 'username', 'role']});
		
		res.status(200).json({ users: usersFound.map( (user) => ({
				'firstname': user.firstName,
				'lastname': user.lastName,
				'username': user.username,
				'role': user.role, 
			}))}); 
	} catch(error) {
		consoel.error(error);
		res.status(500).json( { status : 'failed'})
	}
}

router.get('/admin/get_users', isAdminAuthenticated, getUsers);
module.exports = router;