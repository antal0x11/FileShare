const User = require('../models/users');
const Logger = require('../lib/logger');

module.exports = {
	isAuthenticated: async (req, res, next) => {
		if (req.session && req.session.userId) {
			try {
				const dbLookUp = await User.findOne({ where : { id : req.session.userId }});
				if (dbLookUp) {
					next();
				} else {
					res.status(403).redirect('/');
				}
			} catch(error) {
				Logger.error({
					'description': error.toString(),
					'path': 'fn isAuthenticated'
				});
				res.status(403).redirect('/login');
			}
		} else {
			res.status(403).redirect('/login');
		}
	},
	isAdminAuthenticated: async (req, res, next) => {
		if (req.session && req.session.userId) {
			try {
				const dbLookUp = await User.findOne({ where : { id : req.session.userId }});
				if (dbLookUp && dbLookUp.role === 'admin') {
					next();
				} else {
					res.status(403).redirect('/');
				}
			} catch(error) {
				Logger.error({
					'description': error.toString(),
					'path': 'fn isAuthenticated'
				});
				res.status(403).redirect('/login');
			}
		} else {
			res.status(403).redirect('/login');
		}
	}
};