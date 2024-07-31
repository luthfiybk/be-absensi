const { PrismaClient, Prisma } = require('@prisma/client')
const { count } = require('./User')
const prisma = new PrismaClient()

const Presensi = {
    count: async () => {
        try {
            const response = await prisma.presensi.count()

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    getAll: async (nama, tanggal, statusId, divisiId, limit, offset) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT 
                    Presensi.id, 
                    User.no_karyawan, 
                    User.nama, 
                    Presensi.tanggal, 
                    Presensi.jamMasuk, 
                    Presensi.statusId, 
                    Status.nama_status as 'status' 
                FROM Presensi
                LEFT JOIN User ON Presensi.no_karyawan = User.no_karyawan
                LEFT JOIN Status ON Presensi.statusId = Status.id
                WHERE
                (User.nama LIKE CONCAT('%', ${nama}, '%') OR User.nama IS NULL)
                AND (Presensi.tanggal LIKE CONCAT('%', ${tanggal}, '%') OR Presensi.tanggal IS NULL)
                AND (Presensi.statusId IS NULL OR Presensi.statusId = ${statusId} OR ${statusId} IS NULL)
                AND (User.divisiId = ${divisiId} OR ${divisiId} IS NULL)
                LIMIT ${limit}
                OFFSET ${offset}
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    getByNoKaryawan: async (no_karyawan) => {
        try {
            const response = await prisma.presensi.findUnique({
                where: {
                    no_karyawan: no_karyawan
                }
            })

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    presensiMasuk: async (no_karyawan, data, id) => {
        try {
            
            const response = await prisma.presensi.create({
                data: {
                    ...data,
                    user: { 
                        connect: { 
                            no_karyawan: no_karyawan
                        }
                    },
                    status: {
                        connect: {
                            id: id
                        }
                    }
                }
            })

            console.log(response)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    check: async (no_karyawan, tanggal) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT * 
                FROM Presensi 
                WHERE tanggal LIKE ${tanggal} AND (no_karyawan IS NULL OR no_karyawan = ${no_karyawan} OR ${no_karyawan} IS NULL)
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    setAlpha: async (no_karyawan) => {
        try {
            const response = await prisma.presensi.create({
                data: {
                    tanggal: new Date(),
                    jamMasuk: new Date(),
                    no_karyawan: no_karyawan,
                    statusId: 3
                }
            })

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    getById: async (id) => {
        try {
            const response = await prisma.$queryRaw`
                SELECT 
                    Presensi.id, 
                    User.no_karyawan, 
                    User.nama, 
                    Presensi.tanggal, 
                    Presensi.jamMasuk, 
                    Presensi.statusId, 
                    Status.nama_status as 'status', 
                    Presensi.latitude, 
                    Presensi.longitude, 
                    Presensi.photo 
                FROM Presensi
                LEFT JOIN User ON Presensi.no_karyawan = User.no_karyawan
                LEFT JOIN Status ON Presensi.statusId = Status.id
                WHERE Presensi.id = ${id}
            `

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = Presensi