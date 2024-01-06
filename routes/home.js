const express = require('express');
const path = require('path');

const router = express.Router();

function home(req,res,next) {

	const options = {
		root: path.join(__dirname,"..","/static/html"),
		dotfiles: 'deny'
	};

	switch(req.session.role) {
	case 'admin':
		options.root = path.join(__dirname,"..","/static/html/admin");
		res.status(200).sendFile('index.html', options, (err) => {
			if(err) {
				console.error(err);
				console.error("[+] Failed to sent html.");
				res.status(500).send("<h3>Server Error</h3>");
			}
		});
		break;
	case 'user':
		options.root = path.join(__dirname,"..","/static/html/user");
		res.status(200).sendFile('index.html', options, (err) => {
			if(err) {
				console.error("[+] Failed to sent html.");
				res.status(500).send("<h3>Server Error</h3>");
			}
		});
		break;
	default:
		res.status(200).sendFile('index.html', options, (err) => {
			if(err) {
				console.error("[+] Failed to sent html.");
				res.status(500).send("<h3>Server Error</h3>");
			}
		});
		break;
	}
}

router.get("/", home);
module.exports = router;