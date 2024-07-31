const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

async function seeder() {
    try {
        const divisi = await prisma.divisi.createMany({
            data: [
                {
                    nama_divisi: 'IT'
                },
                {
                    nama_divisi: 'Human Resource'
                },
                {
                    nama_divisi: 'Finance'
                },
                {
                    nama_divisi: 'Marketing'
                }
            ]
        })

        const role = await prisma.role.createMany({
            data: [
                {
                    nama_role: 'Admin'
                },
                {
                    nama_role: 'Karyawan'
                },
                {
                    nama_role: 'Supervisor'
                }
            ]
        })

        const status = await prisma.status.createMany({
            data: [
                {
                    nama_status: 'Tepat Waktu',
                    group_status: 'Presensi'
                },
                {
                    nama_status: 'Terlambat',
                    group_status: 'Presensi'
                },
                {
                    nama_status: 'Alpha',
                    group_status: 'Presensi'
                },
                {
                    nama_status: 'Izin Diajukan',
                    group_status: 'Izin'
                },
                {
                    nama_status: 'Izin Disetujui',
                    group_status: 'Izin'
                },
                {
                    nama_status: 'Izin Ditolak',
                    group_status: 'Izin'

                }
            ]
        })

        const hashedPassword = await bcrypt.hash('testing', 10)

        const user = await prisma.user.createMany({
            data: [
                {
                    no_karyawan: '1234567890',
                    email: 'fajar@email.com',
                    nama: 'Fajar',
                    password: hashedPassword,
                    roleId: 2,
                    divisiId: 1
                },
                {
                    no_karyawan: '1234567891',
                    email: 'supervisor@email.com',
                    nama: 'Supervisor',
                    password: hashedPassword,
                    roleId: 3,
                    divisiId: 1
                },
                {
                    no_karyawan: '1234567892',
                    email: 'admin@email.com',
                    nama: 'Admin',
                    password: hashedPassword,
                    roleId: 1,
                    divisiId: null
                }
            ]
        })

        console.log('Seeding success', user, divisi, role, status)

    } catch (error) {
        console.error('Failed to seed database', error.message)
    } finally {
        await prisma.$disconnect()
    }
}

seeder()