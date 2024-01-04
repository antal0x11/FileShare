const User = require('../models/users');

module.exports = {
	isAuthenticated: async (req,res,next) => {
		if (req.session) {
			try {
				const dbLookUp = await User.findOne({ where : { id : req.session.userId }});
				if (dbLookUp) {
					next();
				}
			} catch(error) {
				console.error(error);
				res.status(403).redirect('/login');
			}
		} else {
			res.status(403).redirect('/login');
		}
	}
};