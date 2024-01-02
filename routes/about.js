const express = require('express')
const path = require('path');
const router = express.Router();

function about(req,res,next) {
	const options = {
		root: path.join(__dirname, "..", "/static"),
		dotfiles: 'deny'
	};

	res.status(200).sendFile('about.html', options, (err) => {
		if(err) {
			console.error("[+] Failed to sent html.");
			res.status(500).send("<h3>Sever Error</h3>");
		}
	});
}

router.get("/about", about);
module.exports = router;