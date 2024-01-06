const express = require('express');
const path = require('path');

const router = express.Router();

function instructions(req,res,next) {
	const options = {
		root: path.join(__dirname, "..", "/static/html/admin"),
		dotfiles: 'deny'
	};

	switch(req.session.role) {
	case 'admin':
		res.status(200).sendFile('instructions.html', options, (err) => {
			if(err) {
				console.error("[+] Failed to sent html.");
				res.status(500).send("<h3>Server Error</h3>");
			}
		});
		break;
	default:
		options.root = path.join(__dirname, "..", "/static/html");
		res.status(200).sendFile('instructions.html', options, (err) => {
			if(err) {
				console.error(err);
				console.error("[+] Failed to sent html.");
				res.status(500).send("<h3>Server Error</h3>");
			}
		});
		break;
	}
}

router.get("/instructions", instructions);
module.exports = router;