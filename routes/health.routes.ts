import { Router, Request, Response } from 'express';
import { firebaseConfig } from '../config/db';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    firebaseProject: firebaseConfig?.projectId || 'not_specified'
  });
});

export default router;
