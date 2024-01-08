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
const dashboard = require('./routes/admin/dashboard');
const create_user = require('./routes/admin/createUser');
const get_users = require('./routes/admin/getUsers');
const alter_user = require('./routes/admin/alterUser');
const sequelize = require('./config/db');
const Logger = require('./lib/logger');
require('dotenv').config();

sequelize.authenticate().then( async () => {
	Logger.info({ 'description': 'Database Connection Successful', 'path': '/'});
	await sequelize.sync();
	Logger.info({'description': 'Relations Sync Completed', 'path' : '/'});

}).catch( (error) => {
	Logger.error({'description': 'Database Connection Failure.', 'path' : '/'});
	Logger.error({ 'description': error.toString(), 'path': '/'});
});

const app = express();
app.disable('x-powered-by');

app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: { 
		httpOnly: false,
		maxAge: 2 * 60 * 60 * 1000 // valid for 2h
	}
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
app.use('/', dashboard);
app.use('/', create_user);
app.use('/', get_users);
app.use('/', alter_user);

app.listen(process.env.PORT, () => {
	Logger.info({'description' : 'server started', 'path' : '/'});
	console.log('[+] Server is up.');
});