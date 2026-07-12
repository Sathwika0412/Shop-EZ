import { Router } from 'express';
import { getOrders, createOrder, updateOrderStatus } from '../controllers/order.controller';

const router = Router();

router.get('/', getOrders);
router.post('/', createOrder);
router.post('/:id/status', updateOrderStatus);

export default router;
