const express = require('express');
const path = require('path');
const fs = require('fs');
const { createHash } = require('crypto');
const multer = require('multer');
const { isAuthenticated } = require('./authentication');
const File = require('../models/files');
const Logger = require('../lib/logger');

const router = express.Router();

//TODO add multiple files upload

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		try {
			if (req.session.firstname === 'Admin') throw new Error('Admin user cant upload.');
			const directoryDestination = path.join(process.env.UPLOAD, `${req.session.userId}`);
			if (fs.existsSync(directoryDestination)) {
				cb(null, directoryDestination);
			} else {
				throw new Error('Folder should exist.');
			}
		} catch(error) {
			Logger.info({ 'description': error.toString().split(': ')[1], 'path': '/upload', 'method': 'POST' });
		}
	},
	filename: function(req, file, cb) {
		cb(null,file.originalname);
	}
});

const upload = multer({ storage: storage });

function uploadRoute(req, res) {
	
	const options = {
		root: path.join(__dirname, '..', '/static/html/admin'),
		dotfiles: 'deny'
	};

	switch(req.session.role) {
	case 'admin':
		res.status(200).sendFile('upload.html', options, (err) => {
			if(err) {
				Logger.error({
					'description': 'Failed to send upload.html(admin)',
					'path': '/upload',
					'method': 'GET'
				});
				res.status(500).send('<img src="img/500.png" alt="500"/>');
			}
		});
		break;
	default:
		options.root = path.join(__dirname, '..', '/static/html');
		res.status(200).sendFile('upload.html', options, (err) => {
			if(err) {
				Logger.error({
					'description': 'Failed to send upload.html(user)',
					'path': '/upload',
					'method': 'GET'
				});
				res.status(500).send('<img src="img/500.png" alt="500"/>');
			}
		});
		break;
	}
}

async function uploadFile(req, res) {
	try {
		//need to better handle files

		const buffer = fs.readFileSync(req.file.path);
		const fileHash = createHash('sha256').update(buffer).digest('hex');

		const lookUpFile = await File.findOne({ where: { 
			fileName: req.file.originalname,
			userID: req.session.userId
		}});

		//need to store the sha256 of the file, and check if has changed to check
		//for any update that it has
		//add tmp storage

		if (lookUpFile) {
			await File.update({ fileSize: req.file.size / ( 1024 * 1024) },{
				where: {
					userID: req.session.userId, 
					fileName: req.file.originalname
				}
			});
		} else {
			await File.create({
				'userID' : req.session.userId,
				'fileName' : req.file.originalname,
				'firstName' : req.session.firstname,
				'lastName': req.session.lastname,
				'checksum': fileHash,
				'fileSize' : req.file.size / ( 1024 * 1024)
			});
		}
		res.status(200).redirect('/list');
	} catch(error) {
		Logger.error({
			'description': error.toString(),
			'path': '/upload',
			'method': 'POST'
		});
		res.status(500).send('<img src="img/500.png" alt="500"/>');
	}
}

router.get('/upload', isAuthenticated, uploadRoute);
router.post('/upload', isAuthenticated, upload.single('upd_file'), uploadFile);
module.exports = router;