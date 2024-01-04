const express = require('express');

const router = express.Router();

function logout(req, res, next) {
	req.session.destroy( (err) => {
		if (err) {
			res.status(500).send('<h3>Error logging out</h3>');
		} else {
			res.status(200).redirect('/');
		}
	});
}

router.get('/logout', logout);
module.exports = router;