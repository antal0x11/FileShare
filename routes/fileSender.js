const express = require('express');
const path = require('path');
const { isAuthenticated } = require('./authentication');

const router = express.Router();

function fileSender(req, res, next) {

	const fileName = req.params.name;

	const options = {
		maxAge: '1d',
		root: path.join(__dirname, '..', 'uploads'),
		//root: '/uploads',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true,
			'session_id': "some-session-id"
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
}

router.get('/file/:name', isAuthenticated, fileSender);
module.exports = router;