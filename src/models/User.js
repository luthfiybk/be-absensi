const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

const User = {
    count: async () => {
        try {
            const response = await prisma.user.count()

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    getAll: async (nama, limit, offset, roleId, divisiId) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT User.nama, User.no_karyawan, Role.nama_role as 'role', Divisi.nama_divisi as 'divisi', User.email as 'email' FROM User
                LEFT JOIN Role ON User.roleId = Role.id
                LEFT JOIN Divisi ON User.divisiId = Divisi.id
                WHERE
                (User.nama LIKE CONCAT('%', ${nama}, '%') OR User.nama IS NULL)
                AND (User.roleId IS NULL OR User.roleId = ${roleId} OR ${roleId} IS NULL)
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
            const response = await prisma.$queryRaw`
                SELECT User.id, User.nama, User.no_karyawan, User.email, User.password, User.roleId, User.divisiId, Role.nama_role, Divisi.nama_divisi
                FROM User
                LEFT JOIN Role ON User.roleId = Role.id
                LEFT JOIN Divisi ON User.divisiId = Divisi.id
                WHERE User.no_karyawan = ${no_karyawan}
                LIMIT 1
            `

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    getByEmail: async (email) => {
        try {
            const response = await prisma.user.findUnique({
                where: {
                    email: email
                }
            })

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    create: async (no_karyawan, nama, email, password, roleId, divisiId) => {
        try {
            const response = await prisma.user.create({
                data: {
                    no_karyawan: no_karyawan,
                    nama: nama,
                    email: email,
                    password: password,
                    roleId: roleId,
                    divisiId: divisiId
                }
            })

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    update: async (no_karyawan, data) => {
        try {
            const response = await prisma.user.update({
                where: {
                    no_karyawan: no_karyawan
                },
                data: {
                    ...data
                }
            })

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    delete: async (no_karyawan) => {
        try {
            const response = await prisma.user.delete({
                where: {
                    no_karyawan: no_karyawan
                }
            })

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = User