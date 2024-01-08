const express = require('express');
const path = require('path');
const { isAuthenticated } = require('./authentication');
const Logger = require('../lib/logger');

const router = express.Router();

function list(req,res,next) {

	const options = {
		root: path.join(__dirname, "..", "/static/html/admin"),
		dotfiles: 'deny'
	};

	switch(req.session.role) {
	case 'admin':
		res.status(200).sendFile('list.html', options, (err) => {
			if(err) {
				Logger.error({
					'description': 'Failed send list.html(admin) page',
					'path': '/list',
					'method': 'GET'
				});
				res.status(500).send('<img src="img/500.png" alt="500"/>');
			}
		});
		break;
	default:
		options.root = path.join(__dirname, "..", "/static/html");
		res.status(200).sendFile('list.html', options, (err) => {
			if(err) {
				Logger.error({
					'description': 'Failed send list.html(user) page',
					'path': '/list',
					'method': 'GET'
				});
				res.status(500).send('<img src="img/500.png" alt="500"/>');
			}
		});
		break;
	}
}

router.get("/list", isAuthenticated, list);
module.exports = router;