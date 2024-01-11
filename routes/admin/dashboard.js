const express = require('express');
const path = require('path');
const { isAdminAuthenticated } = require('../authentication');
const Logger = require('../../lib/logger');

const router = express.Router();

function dashboard(req, res) {
	const options = {
		root: path.join(__dirname,'..', '..', '/static/html', 'admin'),
		dotfiles: 'deny'
	};

	res.status(200).sendFile('dashboard.html', options, (err) => {
		if(err) {
			Logger.error({
				'description': 'Failed to send dashboard.html page',
				'path': '/admin/dashboard'
			});
			res.status(500).send('<img src="../img/500.png" alt="500"/>');
		}
	});
}

router.get('/admin/dashboard', isAdminAuthenticated, dashboard);
module.exports = router;