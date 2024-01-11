const express = require('express');
const Logger = require('../lib/logger');

const router = express.Router();

function logout(req, res) {
	req.session.destroy( (err) => {
		if (err) {
			Logger.error({
				'description': 'Failed to logout',
				'path': '/logout',
				'method': 'GET'
			});
			res.status(500).send('<img src="img/500.png" alt="500"/>');
		} else {
			res.status(200).redirect('/');
		}
	});
}

router.get('/logout', logout);
module.exports = router;