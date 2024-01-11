const express = require('express');
const { isAuthenticated } = require('./authentication');
const router = express.Router();

function info(req, res) {
	res.type('application/json');

	const { firstname, lastname } = req.session;
	res.status(200).json({
		'firstname': firstname,
		'lastname': lastname
	})
}

router.get('/info', isAuthenticated, info);
module.exports = router;