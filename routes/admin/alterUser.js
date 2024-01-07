const express = require('express');
const User = require('../../models/users');
const File = require('../../models/files');
const { isAdminAuthenticated } = require('../authentication');
const { createHash } = require('crypto');
const fs = require('fs');
const path = require('path');

const router = express.Router();

function validateOptions(req, res, next) {
	if (req.body.usernameReset) {
		if (req.body.usernameReset === 'admin' && req.body.status) {
			res.status(400).redirect('/admin/dashboard');
		} else if (req.body.passwordReset && !req.body.status) {
			next();
		} else if (!req.body.passwordReset && req.body.status) {
			next();
		} else {
			res.status(400).redirect('/admin/dashboard');
		}
	} else {	
		res.status(400).redirect('/admin/dashboard');
	}
}

async function alterUser(req, res, next) { 

	const response = await User.findOne( { where : { 'username' : req.body.usernameReset }});

	if (response) {
		switch(req.body.status) {
		case 'remove':
			try {
				const { id } = response;
				await User.destroy( { where : { 'id' : id }});
				await File.destroy( { where : { userID : id }});

				const userDirectory = path.join(process.env.UPLOAD, id);
				fs.rm( userDirectory, { recursive: true, force: true }, (error) => {
					if (error) throw error;
				});

				res.status(200).redirect('/admin/dashboard');
			} catch(error) {
				console.error(error);
				res.status(500).redirect('/admin/dashboard');
			}
			break;
		default:
			try {
				const pass = createHash('sha256').update(req.body.passwordReset).digest('hex');
				await User.update( { password : pass} , {
					where : {
						username : req.body.usernameReset
					}
				});
				res.status(200).redirect('/admin/dashboard');
			} catch(error) {
				console.error(error);
				res.status(500).redirect('/admin/dashboard');
			}
			break;		
		}
	} else {
		res.status(400).redirect('/admin/dashboard');
	}
}

router.post('/admin/alter-user', isAdminAuthenticated, express.urlencoded( { extended: false }), validateOptions, alterUser);
module.exports = router;