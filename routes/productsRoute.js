const express = require('express');
const { allProducts, detailProducts, createProducts, deleteProducts, updateProducts } = require('../controllers/productsController');

const router = express.Router();

router.get('/products', allProducts);

router.get('/products/:id', detailProducts);

router.post('/products/new', createProducts);

router.delete('/products/:id', deleteProducts);

router.patch('/products/:id', updateProducts);

module.exports = router;