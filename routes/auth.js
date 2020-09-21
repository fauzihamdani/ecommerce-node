const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { body } = require('express-validator');
const User = require('../models/user');
const { response } = require('express');
router.get('/login', authController.getLogin);
router.post(
	'/login',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email address.')
			.normalizeEmail(), // no upper/owercase, no whitespace
		body('password', 'Password has to be valid.')
			.isLength({ min: 5 })
			.isAlphanumeric()
			.trim(), //remove whitespace
	],
	authController.postLogin
);
router.get('/signup', authController.getSignup);
router.post(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('enter a valid email')
			.custom((value, { req }) => {
				return User.findOne({ where: { email: value } }).then((result) => {
					if (result) {
						return Promise.reject(
							'email already exist, please pick another one'
						);
					}
				});
			})
			.normalizeEmail(),
		body(
			'password',
			'Please enter a PAssword with only text and numbers and at least 5 characters'
		).isLength({ min: 5 }),
	],
	authController.postSignup
);
router.post('/logout', authController.postLogout);
module.exports = router;
