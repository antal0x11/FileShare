const express = require('express');
const path = require('path');
const { isAuthenticated } = require('./authentication');

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
				console.error("[+] Failed to sent html.");
				res.status(500).send("<h3>Server Error</h3>");
			}
		});
		break;
	default:
		options.root = path.join(__dirname, "..", "/static/html");
		res.status(200).sendFile('list.html', options, (err) => {
			if(err) {
				console.error("[+] Failed to sent html.");
				res.status(500).send("<h3>Server Error</h3>");
			}
		});
		break;
	}
}

router.get("/list", isAuthenticated, list);
module.exports = router;