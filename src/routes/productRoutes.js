const express = require('express');
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require('../validators/productValidator');

const router = express.Router();

router.use(authMiddleware);

router.get('/products', getProducts);
router.post('/products', createProductValidator, createProduct);
router.put('/products/:id', updateProductValidator, updateProduct);
router.delete('/products/:id', deleteProductValidator, deleteProduct);

module.exports = router;

