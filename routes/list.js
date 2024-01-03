const express = require('express');
const path = require('path');
const { isAuthenticated } = require('./authentication');

const router = express.Router();

function list(req,res,next) {

	const options = {
		root: path.join(__dirname, "..", "/static/html"),
		dotfiles: 'deny'
	};

	res.status(200).sendFile('list.html', options, (err) => {
		if(err) {
			console.error("[+] Failed to sent html.");
			res.status(500).send("<h3>Sever Error</h3>");
		}
	});
}

router.get("/list", isAuthenticated, list);
module.exports = router;