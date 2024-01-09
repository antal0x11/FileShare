const express = require('express');
const path = require('path');
const fs = require('fs');
const { isAuthenticated } = require('./authentication');
const Logger = require('../lib/logger');

const router = express.Router();

function fileSender(req, res, next) {

	const fileName = req.params.name;
	const directoryDestination = path.join(process.env.UPLOAD, req.session.userId);

	try {
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

router.get('/file/:name', isAuthenticated, fileSender);
module.exports = router;