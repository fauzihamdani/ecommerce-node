const Product = require('../models/product');
const Comment = require('../models/comment');
const Feedback = require('../models/feedback');
const User = require('../models/user');

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

// exports.getProduct = (req, res, next) => {
// 	const prodId = req.params.productId;
// 	Comment.findByPk(prodId, {
// 		include: [
// 			{ model: User },
// 			{ model: Feedback, include: ['user'] },
// 			'product',
// 		],
// 	})
// 		.then((comment) => {
// 			console.log(JSON.stringify(comment));
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});
// };

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findByPk(prodId, {
		include: [
			{
				model: Comment,
				include: ['user', { model: Feedback, include: 'user' }],
			},
		],
	})
		.then((productData) => {
			res.render('shop/product-detail', {
				product: productData,
				pageTitle: productData.title,
				path: '/products',
				user: req.session.user,
			});
			console.log(JSON.stringify(productData.comments[0].feedbacks));
		})
		.catch((err) => console.log(err));
};
