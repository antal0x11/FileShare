const express = require('express');
const path = require('path');
const Logger = require('../lib/logger');

const router = express.Router();

function instructions(req, res) {
	const options = {
		root: path.join(__dirname, '..', '/static/html/admin'),
		dotfiles: 'deny'
	};

	switch(req.session.role) {
	case 'admin':
		res.status(200).sendFile('instructions.html', options, (err) => {
			if(err) {
				Logger.error({
					'description': 'Failed send instructions.html(admin) page',
					'path': '/instructions',
					'method': 'GET'
				});
				res.status(500).send('<img src="img/500.png" alt="500"/>');
			}
		});
		break;
	default:
		options.root = path.join(__dirname, '..', '/static/html');
		res.status(200).sendFile('instructions.html', options, (err) => {
			if(err) {
				Logger.error({
					'description': 'Failed send instructions.html(public) page',
					'path': '/instructions',
					'method': 'GET'
				});
				res.status(500).send('<img src="img/500.png" alt="500"/>');
			}
		});
		break;
	}
}

router.get('/instructions', instructions);
module.exports = router;