const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const File = sequelize.define('File', {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false,
		primaryKey: true
	},
	userID: {
		type: DataTypes.UUID,
		allowNull: false
	},
	fileName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	firstName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	lastName: {
		type: DataTypes.STRING,
		allowNull: false
	},
	date: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
		allowNull: false
	},
	checksum: {
		type: DataTypes.STRING,
		allowNull: false
	},
	fileSize: {
		type: DataTypes.DOUBLE
	}
}, { tableName: 'files', timestamps: true });

module.exports = File; 