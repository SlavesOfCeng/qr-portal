// ilerleyen süreçte fakülte, bölüm ekleme admin panelinden
// yürütülecek. şu anlık seeder kullanıyoruz.

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const engFaculty = await prisma.faculty.upsert({
        where: { name: 'Mühendislik Fakültesi' },
        update: {},
        create: { name: 'Mühendislik Fakültesi' }
    });

    const artFaculty = await prisma.faculty.upsert({
        where: { name: 'Güzel Sanatlar Fakültesi' },
        update: {},
        create: { name: 'Güzel Sanatlar Fakültesi' }
    });

    const csDept = await prisma.department.create({
        data: {
            name: 'Bilgisayar Mühendisliği',
            facultyId: engFaculty.id
        }
    });

    const eeDept = await prisma.department.create({
        data: {
            name: 'Elektrik Elektronik Mühendisliği',
            facultyId: engFaculty.id
        }
    });

    const adminPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@qrportal.com' },
        update: {},
        create: {
            email: 'admin@qrportal.com',
            name: 'Sistem Yöneticisi',
            password: adminPassword,
            role: Role.ADMIN,
            slug: 'admin'
        }
    });

    const academic = await prisma.user.upsert({
        where: { email: 'prof@university.edu' },
        update: { departmentId: csDept.id },
        create: {
            email: 'prof@university.edu',
            name: 'Dr. Ahmet Yilmaz',
            password: 'hashed_password_here',
            role: Role.ACADEMIC,
            slug: 'ahmet-yilmaz',
            bio: 'Bilgisayar Mühendisliği Bölüm Başkanı.',
            qrCodeUrl: 'http://localhost:3000/academic/ahmet-yilmaz',
            departmentId: csDept.id,
            title: 'Prof. Dr.',
            schedules: [
                { day: 1, startTime: '10:00', endTime: '12:00', location: 'B-101', isOfficeHour: true },
            ]
        },
    });

    console.log({ engFaculty, csDept, academic });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
