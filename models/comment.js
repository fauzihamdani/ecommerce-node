const sequelize = require('../utils/database');
const Sequelize = require('sequelize');

const Comment = sequelize.define('comment', {
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
module.exports = Comment;
