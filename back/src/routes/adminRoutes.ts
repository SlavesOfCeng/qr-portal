import { Router } from 'express';
import {
    getPendingRequests,
    updateRequestStatus,
    createAcademic,
    deleteUser,
    generateQRCode,
    getDashboardStats,
    getAllRequestsArchive,
    hardDeleteRequest,
    getUsers,
    updateUser
} from '../controllers/adminController';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateToken);
router.use(authorizeRole([Role.ADMIN]));

router.get('/stats', getDashboardStats);
router.get('/requests', getPendingRequests);
router.get('/requests/archive', getAllRequestsArchive);
router.delete('/requests/:id', hardDeleteRequest);
router.put('/requests/:id', updateRequestStatus);

router.get('/users', getUsers);
router.post('/users', createAcademic); // Generalized to handle any role
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.post('/academic', createAcademic);
router.delete('/academic/:id', deleteUser);

router.post('/qr-code', generateQRCode);

export default router;
