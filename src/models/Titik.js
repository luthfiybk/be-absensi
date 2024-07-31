const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

const Titik = {
    count: async () => {
        try {
            const response = await prisma.titik.count()

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    getAll: async (nama, limit, offset) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT id, nama_titik as nama, latitude, longitude, radius FROM titik
                WHERE nama_titik LIKE CONCAT('%', ${nama}, '%')
                LIMIT ${limit}
                OFFSET ${offset}
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    add: async (data) => {
        try {
            const response = await prisma.titik.create({
                data: {
                    ...data
                }
            })

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    update: async (id, nama_titik, latitude, longitude, radius) => {
        try {
            const response = await prisma.titik.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    nama_titik: nama_titik,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    radius: parseInt(radius)
                }
            })

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    getNearest: async (lat, lng) => {
        try {
            const response = await prisma.$queryRaw`
                SELECT id, radius, 
                (6371 * acos(cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(latitude)))) AS distance 
                FROM Titik 
                HAVING distance <= radius / 1000
            `

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    delete: async (id) => {
        try {
            const response = await prisma.titik.delete({
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

module.exports = Titik