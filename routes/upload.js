const express = require('express');
const path = require('path');
const fs = require('fs');
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
			Logger.info({ 'description': error.toString().split(': ')[1], 'path': '/upload', 'method': 'post' });
			Logger.debug({ 'description': error.toString().split(': ')[1], 'path': '/upload', 'method': 'post' });
		}
	},
	filename: function(req, file, cb) {
		cb(null,file.originalname);
	}
})

const upload = multer({ storage: storage });

function uploadRoute(req, res, next) {
	
	const options = {
		root: path.join(__dirname, '..', '/static/html/admin'),
		dotfiles: 'deny'
	};

	switch(req.session.role) {
	case 'admin':
		res.status(200).sendFile('upload.html', options, (err) => {
			if(err) {
				console.error("[+] Failed to sent html.");
				res.status(500).send("<h3>Server Error</h3>");
			}
		});
		break;
	default:
		options.root = path.join(__dirname, '..', '/static/html');
		res.status(200).sendFile('upload.html', options, (err) => {
			if(err) {
				console.error("[+] Failed to sent html.");
				res.status(500).send("<h3>Server Error</h3>");
			}
		});
		break;
	}
}

async function uploadFile(req, res, next) {
	try {
		//need to better handle files
		const lookUpFile = await File.findOne({ where: { 
			fileName: req.file.originalname,
			userID: req.session.userId
		}});

		//need to store the sha256 of the file, and check if has changed to check
		//for any update that it has

		if (lookUpFile) {
			await File.update({ fileSize: req.file.size / ( 1024 * 1024) },{where: { userID: req.session.userId, fileName: req.file.originalname}});
		} else {
			await File.create({
				'userID' : req.session.userId,
				'fileName' : req.file.originalname,
				'firstName' : req.session.firstname,
				'lastName': req.session.lastname,
				'fileSize' : req.file.size / ( 1024 * 1024)
			});
		}
		res.status(200).redirect('/list');
	} catch(error) {
		console.error(error);
		res.status(500).redirect('/list');
	}
}

router.get("/upload", isAuthenticated, uploadRoute);
router.post("/upload", isAuthenticated, upload.single("upd_file"), uploadFile);
module.exports = router;