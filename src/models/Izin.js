const { PrismaClient, Prisma } = require('@prisma/client')
const { check } = require('./Presensi')
const prisma = new PrismaClient()

const Izin = {
    count: async () => {
        try {
            const response = await prisma.izin.count()

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    getAll: async (nama, tanggal, statusId, divisiId, limit, offset) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT Izin.id, User.no_karyawan, User.nama, Izin.tanggal, Izin.statusId, Izin.keterangan, Status.nama_status as 'status' FROM Izin
                LEFT JOIN User ON Izin.no_karyawan = User.no_karyawan
                LEFT JOIN Status ON Izin.statusId = Status.id
                WHERE
                (User.nama LIKE CONCAT('%', ${nama}, '%') OR User.nama IS NULL)
                AND (Izin.tanggal LIKE CONCAT('%', ${tanggal}, '%') OR Izin.tanggal IS NULL)
                AND (Izin.statusId IS NULL OR Izin.statusId = ${statusId} OR ${statusId} IS NULL)
                AND (User.divisiId = ${divisiId} OR ${divisiId} IS NULL)
                LIMIT ${limit}
                OFFSET ${offset}
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    getById: async (izinId) => {
        try {
            const response = await prisma.$queryRaw`
                SELECT User.no_karyawan, User.nama, Izin.tanggal, Izin.statusId, Izin.keterangan, Izin.file, Status.nama_status FROM Izin
                LEFT JOIN User ON Izin.no_karyawan = User.no_karyawan
                LEFT JOIN Status ON Izin.statusId = Status.id
                WHERE Izin.id = ${izinId}
            `

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    applyIzin: async (data) => {
        try {
            const response = await prisma.izin.create({
                data: {
                    ...data
                }
            })

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    updateIzin: async (id, statusId) => {
        try {
            const response = await prisma.izin.update({
                where: {
                    id: id
                },
                data: {
                    statusId: statusId
                }
            })

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    approveIzin: async (izinId, statusId) => {
        try {
            const response = await prisma.izin.update({
                where: {
                    id: izinId
                },
                data: {
                    statusId: statusId
                }
            })

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    rejectIzin: async (izinId, statusId) => {
        try {
            const response = await prisma.izin.update({
                where: {
                    id: izinId
                },
                data: {
                    statusId: statusId
                }
            })

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    rekapIzin: async (no_karyawan, limit, offset) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT
                    Izin.id,
                    Izin.no_karyawan,
                    Izin.tanggal,
                    Izin.keterangan,
                    Izin.statusId,
                    Status.nama_status as 'status'
                FROM Izin
                LEFT JOIN Status ON Izin.statusId = Status.id
                WHERE Izin.no_karyawan = ${no_karyawan}
                LIMIT ${limit}
                OFFSET ${offset}
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    countRekapIzin: async (no_karyawan) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT COUNT(*) as total FROM Izin
                WHERE no_karyawan = ${no_karyawan}
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    check: async (no_karyawan, tanggal) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT *
                FROM Izin
                WHERE no_karyawan = ${no_karyawan}
                AND tanggal = ${tanggal}
                AND statusId = 6
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = Izin