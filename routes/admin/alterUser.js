const express = require('express');
const User = require('../../models/users');
const File = require('../../models/files');
const { isAdminAuthenticated } = require('../authentication');
const { createHash } = require('crypto');
const fs = require('fs');
const path = require('path');
const Logger = require('../../lib/logger');

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

async function alterUser(req, res) { 

	const response = await User.findOne( { where : { 'username' : req.body.usernameReset }});

	if (response) {
		switch(req.body.status) {
		case 'remove':
			try {

				if (response.id === req.session.userId) {
					throw new Error('Unable to remove same id user');
				}
				const { id } = response;
				await User.destroy( { where : { 'id' : id }});
				await File.destroy( { where : { userID : id }});

				const userDirectory = path.join(process.env.UPLOAD, id);
				const tmpUserDirectory = path.join(process.env.TMP, id);
				
				fs.rm( userDirectory, { recursive: true, force: true }, (error) => {
					if (error) throw error;
				});

				fs.rm( tmpUserDirectory, { recursive: true, force: true }, (error) => {
					if (error) throw error;
				});

				res.status(200).redirect('/admin/dashboard');
			} catch(error) {

				switch(error.toString()){
				case 'Error: Unable to remove same id user':
					Logger.warning({
						'description': 'Trying to remove same session user',
						'path': '/admin/alter-user'
					});
					res.status(200).redirect('/admin/dashboard');
					break;
				default:
					Logger.error({
						'description': 'Failed to remove user',
						'path': '/admin/alter-user'
					});
					res.status(500).send('<img src="../img/500.png" alt="500"/>');
					break;
				}
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
				Logger.error({
					'description': 'Failed to change user password',
					'path': '/admin/alter-user'
				});
				res.status(500).send('<img src="../img/500.png" alt="500"/>');
			}
			break;		
		}
	} else {
		res.status(400).redirect('/admin/dashboard');
	}
}

router.post('/admin/alter-user', isAdminAuthenticated, express.urlencoded( { extended: false }), validateOptions, alterUser);
module.exports = router;