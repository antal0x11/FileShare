const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, path.join(__dirname, 'uploads/')) 
		//cb(null, '/uploads'); 
	},
	filename: function(req, file, cb) {
		const uniqueFileName = Date.now() + '-' + file.originalname;
		cb(null, uniqueFileName);
	}
})

const upload = multer({ storage: storage });

app.use(session({
	secret: 'supersecret',
	resave: false,
	saveUninitialized: true,
	cookie: { httpOnly: false }
}));

app.use(express.static('static'));

function isAuthenticated (req,res,next) {
	if (req.session && req.session.user) next()
	else res.redirect('/login')
}

app.get("/", (req,res,next) => {

	const options = {
		root: path.join(__dirname, "/static"),
		dotfiles: 'deny'
	};

	res.status(200).sendFile('index.html', options, (err) => {
		if(err) {
			console.error("[+] Failed to sent html.");
			res.status(500).send("<h3>Sever Error</h3>");
		}
	});
});

app.get("/list", isAuthenticated, (req,res,next) => {

	const options = {
		root: path.join(__dirname, "/static"),
		dotfiles: 'deny'
	};

	res.status(200).sendFile('list.html', options, (err) => {
		if(err) {
			console.error("[+] Failed to sent html.");
			res.status(500).send("<h3>Sever Error</h3>");
		}
	});
});

app.get("/instructions", (req,res,next) => {

	const options = {
		root: path.join(__dirname, "/static"),
		dotfiles: 'deny'
	};

	res.status(200).sendFile('instructions.html', options, (err) => {
		if(err) {
			console.error("[+] Failed to sent html.");
			res.status(500).send("<h3>Sever Error</h3>");
		}
	});
});

app.get("/about", (req,res,next) => {

	const options = {
		root: path.join(__dirname, "/static"),
		dotfiles: 'deny'
	};

	res.status(200).sendFile('about.html', options, (err) => {
		if(err) {
			console.error("[+] Failed to sent html.");
			res.status(500).send("<h3>Sever Error</h3>");
		}
	});
});

app.get("/login", (req,res,next) => {

	const options = {
		root: path.join(__dirname, "/static"),
		dotfiles: 'deny'
	};

	res.status(200).sendFile('login.html', options, (err) => {
		if(err) {
			console.error("[+] Failed to sent html.");
			res.status(500).send("<h3>Sever Error</h3>");
		}
	});
});

app.get("/files/list", isAuthenticated, (req,res,next) => {
	let resArray = new Array();
	let response =  '<ul>';
	fs.readdirSync(path.join(__dirname, 'uploads')).forEach(file => {
	// fs.readdirSync('/uploads').forEach(file => {
		response += `<li>${file}</li>`;
		resArray.push(file);
	});
	response += '</ul>';
	res.status(200).json({file : resArray});
	//res.status(200).send(response);


});

app.get("/file/:name", isAuthenticated, (req,res,next) => {

	const fileName = req.params.name;

	const options = {
		maxAge: '1d',
		root: path.join(__dirname, 'uploads'),
		//root: '/uploads',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true,
			'session_id': "some-session-id"
		},
		dotfiles: 'ignore',
		acceptRanges: true,
		cacheControl: true,
		immutable: false
	};

	res.status(200).download(fileName,options, (err) => {
		if (err) {
			console.error('[+] File Sent Error.');
			console.error(err);
			res.status(500).send("File Sent Error");
		} else {
			console.log('[+] File Sent.');
		}
	});
});

app.get("/upload", isAuthenticated, (req,res,next)=> {
	const options = {
		root: path.join(__dirname, "/static"),
		dotfiles: 'deny'
	};

	res.status(200).sendFile('upload.html', options, (err) => {
		if(err) {
			console.error("[+] Failed to sent html.");
			res.status(500).send("<h3>Server Error</h3>");
		}
	});
});

app.post('/upload', isAuthenticated, upload.single('test_file'),(req,res,next) => {
	res.status(200).redirect('/list');
});

app.post('/login', express.urlencoded({ extended: false }), (req,res,next) => {
	req.session.regenerate((err) => {
		if (err) {
			console.error('[+] Login Error.');
		}

		if (req.body.username === 'luna' && req.body.password === '12345') {
			req.session.user = "some-user-id-12345-67890";

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
	})
});

app.get('/logout', (req,res,next) => {

	req.session.destroy( (err) => {
		if (err) {
			res.status(500).send('<h3>Error logging out</h3>');
		} else {
			res.clearCookie('connect.sid', { path: '/', domain: 'localhost' });
			res.status(200).redirect('/');
		}
	})
});

app.listen(port, () => {
	console.log('[+] Server is up.');
})