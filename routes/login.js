const express = require('express');
const path = require('path');
const { createHash } = require('crypto');
const User = require('../models/users');

const router = express.Router();

function loginUI(req, res, next) {

	const options = {
		root: path.join(__dirname, '..', '/static/html'),
		dotfiles: 'deny'
	};

	res.status(200).sendFile('login.html', options, (err) => {
		if(err) {
			console.error("[+] Failed to sent html.");
			res.status(500).send("<h3>Server Error</h3>");
		}
	});
}

function loginServer(req, res, next) {

	req.session.regenerate( async (err) => {
		if (err) {
			console.error('[+] Login Error.');
		}

		const response = await getUser(req.body.username,req.body.password);

		if (response) {
			req.session.userId = response.id;
			req.session.firstname = response.firstname;
			req.session.lastname = response.lastname;
			req.session.role = response.role;

			req.session.save((err) => {
				if (err) {
					console.error('[+] Some Error.');
				} else {
					if (req.session.role === 'admin') {
						res.status(200).redirect('/admin/dashboard');
					} else {
						res.status(200).redirect('/list');
					}
				}
			})
		} else {
			res.status(403).redirect('/login');
		}
	});
}

async function getUser(username,password) {

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
}

router.get('/login', loginUI);
router.post('/login', express.urlencoded({ extended: false }), loginServer);
module.exports = router;