const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	Product.findAll().then((products) => {
		console.log(req.session.isLoggedIn);
		res.render('shop/index', {
			products: products,
			pageTitle: 'Shop',
			path: '/',
		});
	});
};
