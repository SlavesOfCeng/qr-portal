import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { academicId, type, content, fingerprintId, ipAddress, userAgent, deviceInfo } = req.body;

        let student = await prisma.studentVisitor.findUnique({
            where: { fingerprintId }
        });

        if (!student) {
            student = await prisma.studentVisitor.create({
                data: { fingerprintId, ipAddress, userAgent, metadata: deviceInfo || {} }
            });
        } else {
            if (student.blocked) {
                return res.status(403).json({ success: false, message: 'Erişim engellendi. (Sistem tarafından bloklandınız)' });
            }
            await prisma.studentVisitor.update({
                where: { id: student.id },
                data: { ipAddress, userAgent, metadata: deviceInfo || {} }
            });
        }

        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const recentRequests = await prisma.request.count({
            where: {
                studentId: student.id,
                createdAt: { gte: fiveMinutesAgo }
            }
        });

        if (recentRequests >= 3) {
            // Log risk and potentially block
            await prisma.riskLog.create({
                data: {
                    studentId: student.id,
                    ipAddress: ipAddress || 'unknown',
                    action: 'RATE_LIMIT_EXCEEDED',
                    riskScore: 50,
                    riskLevel: 'HIGH',
                    details: '5 dakika içinde 3+ istek gönderildi.'
                }
            });
            return res.status(429).json({ success: false, message: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.' });
        }

        let riskScore = 0;
        let riskDetails = [];
        const badWords = ['küfür', 'hakaret', 'saldırı', 'aptal', 'gerizekalı']; // Example list

        for (const word of badWords) {
            if (content.toLowerCase().includes(word)) {
                riskScore += 20;
                riskDetails.push(`Yasaklı kelime: ${word}`);
            }
        }

        const isRisk = riskScore > 0;

        if (isRisk) {
            await prisma.riskLog.create({
                data: {
                    studentId: student.id,
                    ipAddress: ipAddress || 'unknown',
                    action: 'CONTENT_RISK',
                    riskScore: riskScore,
                    riskLevel: riskScore > 40 ? 'HIGH' : 'MEDIUM',
                    details: riskDetails.join(', ')
                }
            });

            if (riskScore >= 60) {
                await prisma.studentVisitor.update({
                    where: { id: student.id },
                    data: { blocked: true }
                });
                return res.status(403).json({ success: false, message: 'Mesaj içeriğiniz nedeniyle erişiminiz engellendi.' });
            }
        }

        const request = await prisma.request.create({
            data: {
                academicId,
                studentId: student.id,
                type,
                content,
                isRisk,
                status: 'PENDING'
            },
            include: { student: true, academic: { select: { name: true } } }
        });

        if ((req as any).io) {
            (req as any).io.emit('new_request', request);
        }

        res.status(201).json({ success: true, data: request });

    } catch (error) {
        next(error);
    }
};
