import { Router } from 'express';
import { artisanAdvisor } from '../controllers/ai.controller';

const router = Router();

router.post('/artisan-advisor', artisanAdvisor);

export default router;
