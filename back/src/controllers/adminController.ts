import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                department: {
                    include: { faculty: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

export const getPendingRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requests = await prisma.request.findMany({
            where: { status: 'PENDING' },
            include: {
                student: true,
                academic: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: requests });
    } catch (error) {
        next(error);
    }
};

export const updateRequestStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const request = await prisma.request.update({
            where: { id },
            data: { status }
        });

        res.json({ success: true, data: request });
    } catch (error) {
        next(error);
    }
};

export const createAcademic = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, title, departmentId, bio } = req.body;

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(400).json({ success: false, message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        // Basic slug generation
        const slug = name.toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const academic = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: (req.body.role as Role) || Role.ACADEMIC,
                title,
                departmentId,
                bio,
                slug: slug + '-' + Date.now().toString().slice(-4),
            }
        });
        res.status(201).json({ success: true, data: academic });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, email, role, title, departmentId, bio, password } = req.body;

        const updateData: any = {
            name,
            email,
            role,
            title,
            departmentId,
            bio
        };

        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (name) {
            const slug = name.toLowerCase()
                .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
                .replace(/ /g, '-').replace(/[^\w-]+/g, '');
            updateData.slug = slug + '-' + id.slice(-4);
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData
        });

        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id } });
        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        next(error);
    }
};


export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalAcademics = await prisma.user.count({ where: { role: 'ACADEMIC' } });
        const totalRequests = await prisma.request.count();
        const pendingRequests = await prisma.request.count({ where: { status: 'PENDING' } });

        // Risk stats
        const riskStats = await prisma.riskLog.groupBy({
            by: ['riskLevel'],
            _count: { riskLevel: true }
        });

        // Recent requests for simple list
        const recentRequests = await prisma.request.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { student: true, academic: { select: { name: true } } }
        });

        res.json({
            success: true,
            data: {
                totalAcademics,
                totalRequests,
                pendingRequests,
                riskStats,
                recentRequests
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAllRequestsArchive = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const total = await prisma.request.count();
        const requests = await prisma.request.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                student: true,
                academic: { select: { name: true } }
            }
        });

        res.json({
            success: true,
            data: requests,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

export const hardDeleteRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.request.delete({ where: { id } });
        res.json({ success: true, message: 'Request permanently deleted' });
    } catch (error) {
        next(error);
    }
};

export const generateQRCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { academicId } = req.body;
        const academic = await prisma.user.findUnique({ where: { id: academicId } });
        if (!academic || !academic.slug) return res.status(404).json({ success: false, message: 'Academic not found or no slug' });

        const url = `${process.env.DOMAIN}/academic/${academic.slug}`;

        await prisma.user.update({
            where: { id: academicId },
            data: { qrCodeUrl: url }
        });

        res.json({ success: true, qrCodeUrl: url });
    } catch (error) {
        next(error);
    }
};
