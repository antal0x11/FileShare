const express = require('express');
const fs = require('fs');
const path = require('path');
const File = require('../models/files');
const Logger = require('../lib/logger');
const { isAuthenticated } = require('./authentication');

const router = express.Router();

async function validateBody(req, res, next) {

	res.type('application/json');

	if (req.body.filename && req.body.firstname && req.body.lastname) {
		const lookup = await File.findOne({
			where: {
				'fileName' : req.body.filename,
				'userID': req.session.userId,
				'firstName': req.body.firstname,
				'lastName': req.body.lastname
			}
		});
		if(lookup) {
			next();
		} else {
			res.status(404).json({
				'status': 'ok',
				'info': 'file not found'
			});
		}
	} else {
		res.status(400).json({
			'status': 'fail',
			'reason': 'missing arguments'
		});
	}
}

async function removeFile(req, res) {
	const { filename, firstname, lastname } = req.body;
	const { userId } = req.session;

	try {
		await File.destroy({
			where: {
				'fileName': filename,
				'userID': userId,
				'firstName': firstname,
				'lastName': lastname
			}
		});

		fs.unlink(path.join(process.env.UPLOAD, userId, filename), (err) => {
			if (err) throw err;
		});

		res.status(200).json({
			'status': 'ok'
		});

	} catch(error) {
		Logger.error({
			'description': error.toString(),
			'path': '/remove',
			'method': 'POST'
		});
	}
}

router.post('/remove', isAuthenticated, express.json(), validateBody, removeFile);
module.exports = router;