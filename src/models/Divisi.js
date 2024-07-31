const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

const Divisi = {
    count: async () => {
        try {
            const response = await prisma.divisi.count()

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    getAll: async (nama, limit, offset) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT id, nama_divisi as nama
                FROM divisi
                WHERE nama_divisi LIKE CONCAT('%', ${nama}, '%')
                LIMIT ${limit}
                OFFSET ${offset}
            `)


            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    create: async (nama_divisi) => {
        try {
            const response = await prisma.divisi.create({
                data: {
                    nama_divisi: nama_divisi
                }
            })
            
            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    update: async (id, nama_divisi) => {
        try {
            const response = await prisma.divisi.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    nama_divisi: nama_divisi
                }
            })
        } catch (error) {
            throw new Error(error.message)
        }
    },

    delete: async (id) => {
        try {
            const response = await prisma.divisi.delete({
                where: {
                    id: parseInt(id)
                }
            })

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = Divisi