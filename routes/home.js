const express = require('express');
const path = require('path');
const Logger = require('../lib/logger');

const router = express.Router();

function home(req, res) {

	const options = {
		root: path.join(__dirname,'..','/static/html'),
		dotfiles: 'deny'
	};

	switch(req.session.role) {
	case 'admin':
		options.root = path.join(__dirname,'..','/static/html/admin');
		res.status(200).sendFile('index.html', options, (err) => {
			if(err) {
				Logger.error({
					'description': 'Failed send index.html(admin) page',
					'path': '/',
					'method': 'GET'
				});
				res.status(500).send('<img src="img/500.png" alt="500"/>');
			}
		});
		break;
	case 'user':
		options.root = path.join(__dirname,'..','/static/html/user');
		res.status(200).sendFile('index.html', options, (err) => {
			if(err) {
				Logger.error({
					'description': 'Failed send index.html(user) page',
					'path': '/',
					'method': 'GET'
				});
				res.status(500).send('<img src="img/500.png" alt="500"/>');
			}
		});
		break;
	default:
		res.status(200).sendFile('index.html', options, (err) => {
			if(err) {
				Logger.error({
					'description': 'Failed send index.html(public) page',
					'path': '/',
					'method': 'GET'
				});
				res.status(500).send('<img src="img/500.png" alt="500"/>');
			}
		});
		break;
	}
}

router.get('/', home);
module.exports = router;