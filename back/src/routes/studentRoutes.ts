import { Router } from 'express';
import { createRequest } from '../controllers/studentController';

const router = Router();

router.post('/request', createRequest);

export default router;
