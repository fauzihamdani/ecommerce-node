const sequelize = require('../utils/database');
const Sequelize = require('sequelize');

const Feedback = sequelize.define('feedback', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	content: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});
module.exports = Feedback;
