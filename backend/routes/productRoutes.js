import express from 'express';
import asyncHandler from 'express-async-handler';
const router = express.Router();
import {getProducts, getProductById} from '../controllers/productController.js';

router.route('/').get(getProducts);

router.route('/:id').get(getProductById);

export default router;