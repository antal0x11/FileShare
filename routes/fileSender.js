const express = require('express');
const path = require('path');
const fs = require('fs');
const { isAuthenticated } = require('./authentication');

const router = express.Router();

function fileSender(req, res, next) {

	const fileName = req.params.name;
	//need to check that again with db if req.session.userId is valid
	const directoryDestination = path.join(__dirname, '..', 'uploads', req.session.userId);

	try {
		if (fs.existsSync(directoryDestination)) {
			const options = {
				maxAge: '1d',
				root: directoryDestination,
				//root: path.join(__dirname, '..', 'uploads'),
				//root: '/uploads',
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
					console.error('[+] File Sent Error.');
					console.error(err);
					res.status(500).send("File Sent Error");
				} else {
					console.log('[+] File Sent.');
				}
			});
		} else {
			req.session.destroy((error) => {
				if (error) {
					console.error(error);
				}
			});
			res.status(403).json({ 'action': 'forbidden'});
		}
	} catch(error) {
		console.error(error);
		res.status(500).json({ 'error' : 'internal error '});
	}
}

router.get('/file/:name', isAuthenticated, fileSender);
module.exports = router;