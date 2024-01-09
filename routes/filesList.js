const express = require('express');
const { isAuthenticated } = require('./authentication');
const File = require('../models/files');
const Logger = require('../lib/logger');

const router = express.Router();

async function filesList(req, res, next) {

	const resArray = new Array();

	try {
		const resArray = new Array();

		const results = await File.findAll({
			attributes: {
				exclude: ['id', 'userID']
			}
		});

		results.map( (item) => {
			const dt = new Date(item.date);
			const sdt = new Date(item.updatedAt);

			resArray.push({
				'name' : item.fileName,
				'author' : item.firstName + ' ' + item.lastName,
				'date' : dt.toString().split(' G')[0],
				'lastUpdate' : sdt.toString().split( 'G')[0],
				'size' : item.fileSize.toFixed(3) + ' MB'
			})
		})

		res.status(200).json({files : resArray});
	} catch(error) {
		Logger.error({
			'description': error.toString(),
			'path': '/files/list',
			'method': 'GET'
		});
		res.status(500).json({file : resArray});
	}
}

router.get('/files/list', isAuthenticated, filesList);
module.exports = router;