const express = require('express');
const path = require('path');

const router = express.Router();

function loginUI(req, res, next) {

	const options = {
		root: path.join(__dirname, '..', '/static/html'),
		dotfiles: 'deny'
	};

	res.status(200).sendFile('login.html', options, (err) => {
		if(err) {
			console.error("[+] Failed to sent html.");
			res.status(500).send("<h3>Sever Error</h3>");
		}
	});
}

function loginServer(req, res, next) {

	req.session.regenerate((err) => {
		if (err) {
			console.error('[+] Login Error.');
		}

		if (req.body.username === 'luna' && req.body.password === '12345') {
			req.session.userId = "some-user-id-12345-67890";

			req.session.save((err) => {
				if (err) {
					console.error('[+] Some Error.');
				} else {
					res.redirect('/list');
				}
			})
		} else {
			res.status(403).send('<h3>You have to be signed in</h3>');
		}
	});
}

router.get('/login', loginUI);
router.post('/login', express.urlencoded({ extended: false }), loginServer);
module.exports = router;