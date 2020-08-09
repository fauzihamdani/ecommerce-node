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

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

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
