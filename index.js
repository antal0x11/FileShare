const express = require('express');
const session = require('express-session');
const { isAuthenticated } = require('./routes/authentication');
const home = require('./routes/home');
const list = require('./routes/list');
const instructions = require('./routes/instructions');
const about = require('./routes/about');
const upload = require('./routes/upload');
const filesList = require('./routes/filesList');
const fileSender = require('./routes/fileSender');
const login = require('./routes/login');
const logout = require('./routes/logout');

const app = express();
const port = 3000;

app.use(session({
	secret: 'supersecret',
	resave: false,
	saveUninitialized: true,
	cookie: { httpOnly: false }
}));

app.use(express.static('static'));

app.use('/', home);
app.use('/', list);
app.use('/', instructions);
app.use('/', about);
app.use('/', upload);
app.use('/', filesList);
app.use('/', fileSender);
app.use('/', login);
app.use('/', logout);

app.listen(port, () => {
	console.log('[+] Server is up.');
})