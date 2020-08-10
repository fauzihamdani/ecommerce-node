const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		path: '/admin/edit-product',
		editing: false,
		hasError: false,
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const image = req.file;
	const price = req.body.price;
	const description = req.body.description;
	const imageUrl = image.path;
	return Product.create({
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
