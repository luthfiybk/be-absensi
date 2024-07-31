const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

const Status = {
    getAll: async (nama, group_status, limit, offset) => {
        try {
            const response = await prisma.$queryRaw(Prisma.sql`
                SELECT id, nama_status as nama, group_status FROM status
                WHERE nama_status LIKE CONCAT('%', ${nama}, '%')
                AND (group_status = ${group_status} OR ${group_status} = '')
                LIMIT ${limit}
                OFFSET ${offset}
            `)

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    },

    update: async (id, data) => {
        try {
            const response = await prisma.status.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    ...data
                }
            })

            return response
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

module.exports = Status