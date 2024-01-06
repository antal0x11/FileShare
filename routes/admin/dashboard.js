const express = require('express');
const path = require('path');
const { isAdminAuthenticated } = require('../authentication');

const router = express.Router();

function dashboard(req, res, next) {
	const options = {
		root: path.join(__dirname,'..', '..', '/static/html'),
		dotfiles: 'deny'
	};

	res.status(200).sendFile('dashboard.html', options, (err) => {
		if(err) {
			console.error("[+] Failed to sent html.");
			res.status(500).send("<h3>Server Error</h3>");
		}
	});
}

router.get('/admin/dashboard', isAdminAuthenticated, dashboard);
module.exports = router;