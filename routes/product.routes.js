const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/', productController.getAllProducts); // Lấy tất cả sản phẩm
router.get('/:id', productController.getProductById); // Lấy 1 sản phẩm theo ID
router.post('/', productController.createProduct); // Tạo sản phẩm
router.put('/:id', productController.updateProduct); // Cập nhật sản phẩm
router.delete('/:id', productController.deleteProduct); // Xóa sản phẩm

module.exports = router;
