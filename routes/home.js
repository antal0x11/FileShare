const express = require('express');
const path = require('path');

const router = express.Router();

function home(req,res,next) {
	const options = {
		root: path.join(__dirname,"..","/static/html"),
		dotfiles: 'deny'
	};

	res.status(200).sendFile('index.html', options, (err) => {
		if(err) {
			console.error("[+] Failed to sent html.");
			res.status(500).send("<h3>Sever Error</h3>");
		}
	});
}

router.get("/", home);
module.exports = router;