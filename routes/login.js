const express = require('express');
const path = require('path');
const { createHash } = require('crypto');
const User = require('../models/users');
const Logger = require('../lib/logger');

const router = express.Router();

function loginUI(req, res) {

	const options = {
		root: path.join(__dirname, '..', '/static/html'),
		dotfiles: 'deny'
	};

	res.status(200).sendFile('login.html', options, (err) => {
		if(err) {
			Logger.error({
				'description': 'Failed send login.html page',
				'path': '/login',
				'method': 'GET'
			});
			res.status(500).send('<img src="img/500.png" alt="500"/>');
		}
	});
}

function loginServer(req, res) {

	req.session.regenerate( async (err) => {
		if (err) {
			Logger.error({
				'description': 'Server login fail',
				'path': '/login',
				'method': 'POST'
			});
			res.status(500).send('<img src="img/500.png" alt="500"/>');
			return;
		}

		const response = await getUser(req.body.username,req.body.password);

		if (response) {
			req.session.userId = response.id;
			req.session.firstname = response.firstname;
			req.session.lastname = response.lastname;
			req.session.role = response.role;

			req.session.save((err) => {
				if (err) {
					Logger.error({
						'description': 'Session failed to save',
						'path': '/login',
						'method': 'POST'
					});
					res.status(500).send('<img src="img/500.png" alt="500"/>');
				} else {
					if (req.session.role === 'admin') {
						res.status(200).redirect('/admin/dashboard');
					} else {
						res.status(200).redirect('/list');
					}
				}
			});
		} else {
			res.status(403).redirect('/login');
		}
	});
}

async function getUser(username,password) {

	try {
		const userExists = await User.findOne({ where: {
			username : username,
			password: createHash('sha256').update(password).digest('hex')
		}
		});

		if (userExists === null) {
			return null;
		} else {
			return {
				'id' : userExists.id,
				'username': userExists.username,
				'firstname': userExists.firstName,
				'lastname': userExists.lastName,
				'role': userExists.role
			};
		}
	} catch(error) {
		Logger.error({
			'description': error.toString(),
			'path': '/login',
			'method': 'POST',
			'fn': 'getUser'
		});
		return null;
	}
}

router.get('/login', loginUI);
router.post('/login', express.urlencoded({ extended: false }), loginServer);
module.exports = router;