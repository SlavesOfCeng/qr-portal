import { Router } from 'express';
import academicRoutes from './academicRoutes';
import studentRoutes from './studentRoutes';
import adminRoutes from './adminRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/academic', academicRoutes);
router.use('/student', studentRoutes);
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);

export default router;
