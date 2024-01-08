const fs = require('fs');
require('dotenv').config();

/**
 * msg object has the following attributes
 * description(required)
 * path(required)
 * method(optional)
 * date_time(required)
 * level(required)
 */ 

const Logger = {
	info : (msg) => {
		msg.date_time = new Date().toString().split(' GMT')[0];
		msg.level = 'INFO';

		const report = JSON.stringify(msg) + '\n';

		fs.appendFile(process.env.LOG_FILE, report, (error) => {
			if (error) console.error(error);
		});
	},
	error : (msg) => {
		msg.date_time = new Date().toString().split(' GMT')[0];
		msg.level = 'ERROR';

		const report = JSON.stringify(msg) + '\n';
		
		fs.appendFile(process.env.LOG_FILE, report, (error) => {
			if (error) console.error(error);
		});
	},
	warning: (msg) => {
		msg.date_time = new Date().toString().split(' GMT')[0];
		msg.level = 'WARNING';

		const report = JSON.stringify(msg) + '\n';

		fs.appendFile(process.env.LOG_FILE, report, (error) => {
			if (error) console.error(error);
		});
	},
	debug: (msg) => {
		msg.date_time = new Date().toString().split(' GMT')[0];
		msg.level = 'DEBUG';

		const report = JSON.stringify(msg, null, 4);

		console.error(report);
	}
}

module.exports = Logger;