const express = require('express');
const path = require('path');
const multer = require('multer');
const { isAuthenticated } = require('./authentication');

const router = express.Router();

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, path.join(__dirname, '..','uploads/')) 
		//cb(null, '/uploads'); 
	},
	filename: function(req, file, cb) {
		const uniqueFileName = Date.now() + '-' + file.originalname;
		cb(null, uniqueFileName);
	}
})

const upload = multer({ storage: storage });

function uploadRoute(req, res, next) {
	const options = {
		root: path.join(__dirname, "..", "/static/html"),
		dotfiles: 'deny'
	};

	res.status(200).sendFile('upload.html', options, (err) => {
		if(err) {
			console.error("[+] Failed to sent html.");
			res.status(500).send("<h3>Server Error</h3>");
		}
	});
}

function uploadFile(req, res, next) {
	console.log({ 
		'file' : req.file.originalname, 
		'userId' : req.session.userId, 
		'author' : 'Tony Pink', 
		'date_created' : Date.now(), 
		'size' : req.file.size / (1024 * 1024)
	});
	res.status(200).redirect('/list');
}

router.get("/upload", isAuthenticated, uploadRoute);
router.post("/upload", isAuthenticated, upload.single("test_file"), uploadFile);
module.exports = router;