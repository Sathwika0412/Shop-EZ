import { Router } from 'express';
import { getSeedProducts, getProducts, createProduct } from '../controllers/product.controller';

const router = Router();

router.get('/seed', getSeedProducts);
router.get('/', getProducts);
router.post('/', createProduct);

export default router;
