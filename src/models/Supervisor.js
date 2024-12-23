const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

const Supervisor = {
    dashboard: async (divisiId, tanggal) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT 'Jumlah Karyawan' as kolom, CAST(count(*) as CHAR) as total FROM User WHERE roleId = 2 AND divisiId = ${divisiId} 
                UNION ALL
                SELECT 'Jumlah Karyawan yang Presensi Hari Ini' as kolom, CAST(count(*) as CHAR) as total FROM Presensi
                LEFT JOIN User ON Presensi.no_karyawan = User.no_karyawan WHERE tanggal LIKE CONCAT('%', ${tanggal}, '%') AND User.divisiId = ${divisiId}
                UNION ALL
                SELECT 'Jumlah Karyawan yang Izin Hari Ini' as kolom, CAST(count(*) as CHAR) as total FROM Izin
                LEFT JOIN User ON Izin.no_karyawan = User.no_karyawan WHERE tanggal LIKE CONCAT('%', ${tanggal}, '%') AND User.divisiId = ${divisiId}
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    countKaryawan: async (divisiId, nama) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT count(*) as total_data FROM User
                WHERE divisiId = ${divisiId} AND roleId = 2
                AND (nama LIKE CONCAT('%', ${nama}, '%') OR ${nama} IS NULL)
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    getKaryawan: async (divisiId, nama, limit, offset) => {
        try {
            const response = prisma.$queryRaw(Prisma.sql`
                SELECT User.no_karyawan, User.nama, Divisi.nama_divisi as 'divisi', User.email FROM User
                LEFT JOIN Divisi ON User.divisiId = Divisi.id
                LEFT JOIN Role ON User.roleId = Role.id
                WHERE User.divisiId = ${divisiId} AND User.roleId = 2
                AND (User.nama LIKE CONCAT('%', ${nama}, '%') OR ${nama} IS NULL)
                LIMIT ${limit}
                OFFSET ${offset}
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    countIzin: async (divisiId, nama, tanggal, statusId) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT count(*) as total_data FROM Izin
                LEFT JOIN User ON User.no_karyawan = Izin.no_karyawan
                WHERE User.divisiId = ${divisiId}
                
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    countPresensi: async (divisiId, nama, tanggal, statusId) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT count(*) as total_data FROM Presensi
                LEFT JOIN User ON User.no_karyawan = Presensi.no_karyawan
                WHERE User.divisiId = ${divisiId}
                AND (User.nama LIKE CONCAT('%', ${nama}, '%') OR ${nama} IS NULL)
                AND (Presensi.tanggal LIKE CONCAT('%', ${tanggal}, '%') OR ${tanggal} IS NULL)
                AND (Presensi.statusId IS NULL OR Presensi.statusId = ${statusId} OR ${statusId} IS NULL)
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    getIzin: async (divisiId, nama, tanggal, statusId, limit, offset) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT Izin.id, User.no_karyawan, User.nama, Izin.statusId, Izin.keterangan, Status.nama_status as 'status', Izin.tanggal FROM Izin
                LEFT JOIN User ON User.no_karyawan = Izin.no_karyawan
                LEFT JOIN Status ON Status.id = Izin.statusId
                WHERE User.divisiId = ${divisiId}
                AND
                (User.nama LIKE CONCAT('%', ${nama}, '%') OR User.nama IS NULL)
                AND (Izin.tanggal LIKE CONCAT('%', ${tanggal}, '%') OR Izin.tanggal IS NULL)
                AND (Izin.statusId IS NULL OR Izin.statusId = ${statusId} OR ${statusId} IS NULL)
                LIMIT ${limit}
                OFFSET ${offset}
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    getPresensi: async (divisiId, nama, tanggal, statusId, limit, offset) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT Presensi.id, User.no_karyawan, User.nama, Presensi.tanggal, Presensi.jamMasuk, Presensi.jamPulang, Status.nama_status as 'status', Presensi.statusId
                FROM Presensi
                LEFT JOIN User ON Presensi.no_karyawan = User.no_karyawan
                LEFT JOIN Status ON Presensi.statusId = Status.id
                WHERE User.divisiId = ${divisiId}
                AND (User.nama LIKE CONCAT('%', ${nama}, '%') OR ${nama} IS NULL)
                AND (Presensi.tanggal LIKE CONCAT('%', ${tanggal}, '%') OR ${tanggal} IS NULL)
                AND (Presensi.statusId IS NULL OR Presensi.statusId = ${statusId} OR ${statusId} IS NULL)
                LIMIT ${limit}
                OFFSET ${offset}
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = Supervisor