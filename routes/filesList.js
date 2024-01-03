const express = require('express');
const fs = require('fs');
const path = require('path');
const { isAuthenticated } = require('./authentication');

const router = express.Router();

function filesList(req, res, next) {

	const resArray = new Array();
	fs.readdirSync(path.join(__dirname, '..', 'uploads')).forEach(file => {
	//fs.readdirSync('/uploads').forEach(file => {
		resArray.push(file);
	});
	res.status(200).json({file : resArray});
}

router.get('/files/list', isAuthenticated, filesList);
module.exports = router;