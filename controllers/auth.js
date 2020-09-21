const User = require('../models/user');
const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
	res.render('auth/login', {
		pageTitle: 'Login',
		path: 'auth/login',
		errorMessage: '',
		oldInput: {
			email: '',
			password: '',
		},
		validationErrors: [],
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	const errors = validationResult(req);
	console.log(errors);

	User.findOne({ where: { email: email } })
		.then((user) => {
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save((err) => {
							console.log(err);
							res.redirect('/');
						});
					}
					return res.status(422).render('auth/login', {
						pageTitle: 'Login',
						path: '/login',
						errorMessage: 'Invalid Email or Password',
						oldInput: {
							email: email,
							password: password,
						},
						validationErrors: [],
					});
				})
				.catch((err) => console.log(err));
		})
		.catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	// const errors = validationResult(req);
	// if (!errors.isEmpty()) {
	// 	console.log(errors.array());
	// 	return res.status(422).render('auth/signup', {
	// 		pageTitle: 'SignUp',
	// 		path: '/signup',
	// 		errorMessage: errors.array()[0].msg,
	// 		oldInput: {
	// 			//keeping input inside form
	// 			email: email,
	// 			password: password,
	// 			confirmPassword: req.body.confirmPassword,
	// 		},
	// 		validationErrors: errors.array(),
	// 	});
	// }
	const errors = validationResult(req);
	console.log(errors);
	bcrypt
		.hash(password, 12)
		.then((hashedPassword) => {
			const user = {
				email: email,
				password: hashedPassword,
			};

			res.redirect('/login');
			return User.create(user);
		})
		// .then((result) => {
		// 	var mailOptions = {
		// 		from: 'fauziham93@gmail.com',
		// 		to: email,
		// 		subject: 'harga',
		// 		text: `masih di jual gan?`,
		// 		html: '<h1>halooo</h1> <p>ini masih boleh ditawar gak?</p>',
		// 	};

		// 	transporter.sendMail(mailOptions, function (error, info) {
		// 		if (error) {
		// 			console.log(error);
		// 		} else {
		// 			console.log('Email sent: ' + info.response);
		//
		// 		}
		// 	});
		// });

		.catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
	let message = null;
	res.render('auth/signup', {
		pageTitle: 'SignUp',
		path: '/signup',
		errorMessage: message,
		oldInput: {
			email: '',
			password: '',
			confirmPassword: '',
		},
		validationErrors: [],
	});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/');
	});
};
