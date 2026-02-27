import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/db';
import { Role } from '@prisma/client';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const academic = await prisma.user.findFirst({
            where: { slug, role: Role.ACADEMIC },
            select: {
                id: true,
                name: true,
                bio: true,
                avatarUrl: true,
                slug: true,
                qrCodeUrl: true,
                schedules: true,
            }
        });

        if (!academic) {
            return res.status(404).json({ success: false, message: 'Academic not found' });
        }

        res.json({ success: true, data: academic });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.user?.id;
        if (!id) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const { name, bio, slug, schedules, title, avatarUrl } = req.body;

        const updated = await prisma.user.update({
            where: { id },
            data: { name, bio, slug, schedules, title, avatarUrl }
        });

        res.json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
};

export const getApprovedRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = req.user?.id;
        if (!id) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const requests = await prisma.request.findMany({
            where: {
                academicId: id,
                status: 'APPROVED'
            },
            orderBy: { createdAt: 'desc' },
            include: { student: true }
        });

        res.json({ success: true, data: requests });
    } catch (error) {
        next(error);
    }
};

export const deleteRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const requestId = req.params.id;

        // Ensure the request belongs to this academic
        const request = await prisma.request.findFirst({
            where: { id: requestId, academicId: userId }
        });

        if (!request) return res.status(404).json({ success: false, message: 'Request not found or unauthorized.' });

        await prisma.request.delete({ where: { id: requestId } });

        res.json({ success: true, message: 'Request deleted.' });
    } catch (error) {
        next(error);
    }
};


export const getDashboardStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const totalRequests = await prisma.request.count({ where: { academicId: userId } });
        const pendingRequests = await prisma.request.count({ where: { academicId: userId, status: 'PENDING' } });
        const approvedRequests = await prisma.request.count({ where: { academicId: userId, status: 'APPROVED' } });

        res.json({
            success: true,
            data: {
                totalRequests,
                pendingRequests,
                approvedRequests
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAllAcademics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const academics = await prisma.user.findMany({
            where: { role: Role.ACADEMIC },
            select: {
                id: true,
                name: true,
                title: true,
                avatarUrl: true,
                slug: true,
                department: {
                    select: {
                        name: true,
                        faculty: { select: { name: true } }
                    }
                }
            }
        });
        res.json({ success: true, data: academics });
    } catch (error) {
        next(error);
    }
};
