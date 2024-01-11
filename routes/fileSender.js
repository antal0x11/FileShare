const express = require('express');
const path = require('path');
const fs = require('fs');
const { isAuthenticated } = require('./authentication');
const Logger = require('../lib/logger');
const File = require('../models/files');

const router = express.Router();

async function fileSender(req, res) {

	const fileName = req.params.name;
	const { firstname, lastname } = req.body;

	try {

		const searchFile = await File.findOne({
			where : {
				'fileName' : fileName,
				'firstName': firstname,
				'lastName' : lastname
			}
		});

		if (!searchFile) throw new Error('File Not Found Error');
		const directoryDestination = path.join(process.env.UPLOAD, searchFile.userID);

		if (fs.existsSync(directoryDestination)) {
			const options = {
				maxAge: '1d',
				root: directoryDestination,
				headers: {
					'x-timestamp': Date.now(),
					'x-sent': true
				},
				dotfiles: 'ignore',
				acceptRanges: true,
				cacheControl: true,
				immutable: false
			};

			res.status(200).download(fileName,options, (err) => {
				if (err) {
					Logger.error({
						'description': 'File Sent Error',
						'path': '/files/:name',
						'method': 'GET'
					});
				} else {
					Logger.info({
						'description': 'File Sent',
						'path': '/files/:name',
						'method': 'GET'
					});	
				}
			});
		} else {
			Logger.error({
				'description': 'Directory Not Found',
				'path': '/files/:name',
				'method': 'GET'
			});
			req.session.destroy((error) => {
				if (error) {
					Logger.error({
						'description': error.toString(),
						'path': '/files/:name',
						'method': 'GET'
					});
				}
			});
			res.status(403).send('<img src="img/403.png" alt="403"/>');
		}
	} catch(error) {
		Logger.error({
			'description': error.toString(),
			'path': '/files/:name',
			'method': 'GET'
		});
		res.status(500).send('<img src="img/500.png" alt="500"/>');
	}
}

router.post('/file/:name', isAuthenticated, express.json(),fileSender);
module.exports = router;