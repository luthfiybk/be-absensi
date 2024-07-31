const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const Role = {
    getAll: async () => {
        try {
            const response = await prisma.role.findMany()

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },
}

module.exports = Role