const express = require('express');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

const router = express.Router();

// In-memory products
let products = [
  { id: '1', name: 'Laptop', description: 'High-performance laptop with 16GB RAM', price: 1200, category: 'electronics', inStock: true },
  { id: '2', name: 'Smartphone', description: 'Latest model with 128GB storage', price: 800, category: 'electronics', inStock: true },
  { id: '3', name: 'Coffee Maker', description: 'Programmable coffee maker with timer', price: 50, category: 'kitchen', inStock: false }
];

// ✅ GET /api/products - Get all products
router.get('/', (req, res) => {
  res.json(products);
});

// ✅ GET /api/products/:id - Get specific product
router.get('/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return next(new NotFoundError('Product not found'));
  res.json(product);
});

// ✅ POST /api/products - Create new product
router.post('/', auth, (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || typeof price !== 'number' || !category || typeof inStock !== 'boolean') {
    return next(new ValidationError('Invalid or missing product fields.'));
  }

  const newProduct = { id: uuidv4(), name, description, price, category, inStock };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// ✅ PUT /api/products/:id - Update a product
router.put('/:id', auth, (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));

  const updatedProduct = { ...products[index], ...req.body };
  products[index] = updatedProduct;
  res.json(updatedProduct);
});

// ✅ DELETE /api/products/:id - Delete product
router.delete('/:id', auth, (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError('Product not found'));

  const deleted = products.splice(index, 1);
  res.json({ message: 'Product deleted successfully', product: deleted[0] });
});

module.exports = router;
