const Role = require('../models/Role')

const RoleController = {
    getAll: async (req, res) => {
        try {
            const response = await Role.getAll()

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    update: async (req, res) => {
        const { id } = req.params
        const { nama } = req.body

        try {
            const response = await Role.update(id, { nama })

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = RoleController