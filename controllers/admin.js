const Product = require('../models/product');
const { validationResult } = require('express-validator');
const Comment = require('../models/comment');
const Feedback = require('../models/feedback');
exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/edit-product',
		editing: false,
		hasError: false,
		errorMessage: null,
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const image = req.file;
	const price = req.body.price;
	const description = req.body.description;

	const errors = validationResult(req);
	console.log(errors);

	if (!image) {
		console.log('tes');
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			editing: false,
			hasError: true,
			product: {
				title: title,
				price: price,
				description: description,
			},
			errorMessage: 'Attached file is not an image',
			validationErrors: [],
		});
	}

	const imageUrl = image.path;
	if (!errors.isEmpty()) {
		console.log(imageUrl);
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			path: '/admin/add-product',
			editing: false,
			hasError: true,
			product: {
				title: title,
				imageUrl: imageUrl,
				price: price,
				description: description,
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}

	Product.create({
		title: title,
		imageUrl: imageUrl,
		price: price,
		description: description,
	})
		.then(() => {
			res.redirect('/');
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.postAddComment = (req, res, next) => {
	const content = req.body.content;
	const productId = req.body.productId;
	const userId = req.session.user.id;

	Comment.create({
		content: content,
		productId: productId,
		userId: userId,
	});
	res.redirect('/products/' + productId.toString());
};

exports.postAddFeedback = (req, res, next) => {
	const feedback = req.body.feedback;
	const productId = req.body.productId;
	const userId = req.body.userId;
	const commentId = req.body.commentId;

	Feedback.create({
		content: req.body.feedback,
		commentId: req.body.commentId,
		userId: req.session.user.id,
		productId: req.body.productId,
	});
	res.redirect('/products/' + productId.toString());
};
