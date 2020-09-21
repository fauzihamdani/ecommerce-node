const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const router = express.Router();
const { body } = require('express-validator');

router.get('/add-product', isAuth, adminController.getAddProduct);
router.post(
	'/add-product',
	[
		body('title')
			.isString()
			.isLength({ min: 3 })
			.withMessage('Please enter a valid product and minimal 3 characters')
			.trim(),
		body('price', 'Price must be not empty').isFloat(),
		body('description', 'Description must be not empty')
			.isLength({ min: 5 })
			.trim(),
	],
	adminController.postAddProduct
);
router.post('/comment', isAuth, adminController.postAddComment);
router.post('/feedback', isAuth, adminController.postAddFeedback);
module.exports = router;
