import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getProfile, updateProfile, getApprovedRequests, getAllAcademics, deleteRequest, getDashboardStats } from '../controllers/academicController';

const router = Router();

router.get('/stats', authenticateToken, getDashboardStats);


router.get('/', getAllAcademics); // public
router.get('/:slug', getProfile); // public
router.put('/', authenticateToken, updateProfile); // protected
router.get('/requests/approved', authenticateToken, getApprovedRequests); // protected
router.delete('/requests/:id', authenticateToken, deleteRequest); // protected

export default router;
