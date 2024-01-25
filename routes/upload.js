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
			
		let directoryDestination = path.join(process.env.TMP, `${req.session.userId}`);	

		try {
			if (req.session.firstname === 'Admin') {
				directoryDestination = process.env.TMP;
				req.invalidFileDirectory = true;
				throw new Error('Admin user cant upload.');
			}
			if (!fs.existsSync(directoryDestination)) {
				directoryDestination = process.env.TMP;
				req.invalidFileDirectory = true;
				throw new Error('Folder should exist.');
			}
		} catch(error) {
			Logger.info({ 'description': error.toString().split(': ')[1], 'path': '/upload', 'method': 'POST' });
		} finally {
			cb(null, directoryDestination);
		}
	},
	filename: function(req, file, cb) {
		try {
			const pattern = /^[a-zA-Z0-9_\-\.]+$/;
			const patternEscape = /[<>&"'\/]/; 
			if (!pattern.test(file.originalname) && patternEscape.test(file.originalname)) {
				throw new Error('Improper file name.');
			}
		} catch(error) {
			req.improperFileProps = true;
			Logger.warning({ 'description': error.toString().split(': ')[1], 'path': '/upload', 'method': 'POST' });
		} finally {
			cb(null,file.originalname);
		}
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

function validParams(req, res, next) {

	let source;
	let stopRequest = false;

	if (req.invalidFileDirectory === true) {
		source = path.join(process.env.TMP, req.file.originalname);
		stopRequest = true;
	}

	if (req.improperFileProps === true) {
		stopRequest = true;
		source = path.join(process.env.TMP, req.session.userId, req.file.originalname);
	} 

	if (req.invalidFileDirectory === true && req.improperFileProps === true) {
		source = path.join(process.env.TMP, req.file.originalname);
	}

	if (stopRequest) {
		fs.unlink( source, (error) => {
			if (error) throw error;
		});
		res.status(400).send('<img src="img/400.png" alt="400"/>');
	} else {
		next();
	}
}

async function uploadFile(req, res) {
	try {

		const buffer = fs.readFileSync(req.file.path);
		const fileHash = createHash('sha256').update(buffer).digest('hex');

		const lookUpFile = await File.findOne({ where: { 
			fileName: req.file.originalname,
			userID: req.session.userId
		}});

		const source = path.join(process.env.TMP, req.session.userId, req.file.originalname);
		const destination = path.join(process.env.UPLOAD, req.session.userId, req.file.originalname);

		if (lookUpFile) {
			if (lookUpFile.checksum === fileHash) {
				fs.unlink( source, (error) => {
					if (error) throw error;
				});
			} else {
				await File.update(
					{
						checksum: fileHash, 
						fileSize: req.file.size / ( 1024 * 1024) 
					},{
						where: {
							userID: req.session.userId, 
							fileName: req.file.originalname
						}
					});

				fs.rename(source, destination, (err) => {
					if (err) throw err;
				});
			}
		} else {
			await File.create({
				'userID' : req.session.userId,
				'fileName' : req.file.originalname,
				'firstName' : req.session.firstname,
				'lastName': req.session.lastname,
				'checksum': fileHash,
				'fileSize' : req.file.size / ( 1024 * 1024)
			});

			fs.rename(source, destination, (err) => {
				if (err) throw err;
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
router.post('/upload', isAuthenticated, upload.single('upd_file'), validParams, uploadFile);
module.exports = router;