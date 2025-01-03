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
                    Presensi.jamPulang,
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

    presensiPulang: async (no_karyawan, data, tanggal) => {
        try {
            console.log(no_karyawan, new Date(data), tanggal)
            const response = await prisma.$queryRaw(Prisma.sql`
                UPDATE Presensi
                SET jamPulang = ${new Date(data)}
                WHERE no_karyawan = ${no_karyawan} AND tanggal LIKE ${tanggal};
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
                FROM Presensi 
                WHERE tanggal LIKE ${tanggal} AND no_karyawan = ${no_karyawan}
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
                    Presensi.jamPulang,
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
    },

    rekapPresensi: async (no_karyawan, limit, offset) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT 
                    Presensi.id,
                    Presensi.no_karyawan,
                    Presensi.tanggal, 
                    Presensi.jamMasuk, 
                    Presensi.jamPulang,
                    Presensi.statusId,
                    Status.nama_status as 'status'
                FROM Presensi
                LEFT JOIN Status ON Presensi.statusId = Status.id
                WHERE Presensi.no_karyawan = ${no_karyawan}
                LIMIT ${limit}
                OFFSET ${offset}
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    countRekapPresensi: async (no_karyawan) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT COUNT(*) as total
                FROM Presensi
                WHERE no_karyawan = ${no_karyawan}
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = Presensi