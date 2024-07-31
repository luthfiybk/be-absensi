const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

const Admin = {
    dashboard: async (tanggal) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT 'Jumlah User' as kolom, CAST(count(*) as CHAR) as total FROM User UNION ALL
                SELECT 'Jumlah Karyawan' as kolom, CAST(count(*) as CHAR) as total FROM User WHERE roleId = 2 UNION ALL
                SELECT 'Jumlah Karyawan yang Presensi Hari Ini' as kolom, CAST(count(*) as CHAR) as total FROM Presensi WHERE tanggal LIKE CONCAT('%', ${tanggal}, '%')
                UNION ALL
                SELECT 'Jumlah Karyawan yang Izin Hari Ini' as kolom, CAST(count(*) as CHAR) as total FROM Izin WHERE tanggal LIKE CONCAT('%', ${tanggal}, '%')
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = Admin