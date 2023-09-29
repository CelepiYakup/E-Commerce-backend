const express = require('express');
const { allProducts, detailProducts, createProducts, createReview, deleteProducts, updateProducts,adminProducts } = require('../controllers/productsController');

const router = express.Router();

router.get('/products', allProducts);

router.get('/admin/products', adminProducts);

router.get('/products/:id', detailProducts);

router.post('/products/new', createProducts);

router.post('/products/newReview', createReview);

router.delete('/products/:id', deleteProducts);

router.patch('/products/:id', updateProducts);

module.exports = router;