const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');
const path = require('path');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const session = require('express-session');
const mysqlStore = require('express-mysql-session')(session);
const mysql = require('mysql2');
const csrf = require('csurf');
const app = express();
const User = require('./models/user');
const multer = require('multer');
const Product = require('./models/product');
const fs = require('fs');
const { createVerify } = require('crypto');
// const options = {};
// var connection = mysql.createConnection(options);
// var pool = mysql.createPool(options);
const sessionStore = new mysqlStore({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'ecommerce',
	tableName: 'sessions',
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		fs.mkdir('images', (err) => cb(null, 'images')); //<<null can be error argument, 'images' is the place where save the image data
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + '-' + file.originalname);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
	session({
		key: 'session_cookie_name',
		secret: 'session_cookie_secret',
		store: sessionStore,
		resave: true,
		saveUninitialized: true,
	})
);

app.use(csrfProtection);
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findByPk(req.session.user.id)
		.then((user) => {
			if (!user) {
				console.log('error 2');
				return next();
			}
			req.user = user;
			next();
		})
		.catch((err) => {
			console.log('error 3');
			console.log(err);
		});
});

app.use(shopRoutes);
app.use('/admin', adminRoutes);
app.use(authRoutes);

sequelize
	.sync()
	// sequelize.sync()
	.then(() => {
		app.listen(5454);
	});
