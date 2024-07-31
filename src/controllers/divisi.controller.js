const Divisi = require('../models/Divisi')

const DivisiController = {
    getAll: async (req, res) => {
        try {
            const nama = req.query.search || ''
            const limit = parseInt(req.query.limit) || 10
            const page = Number(req.query.page) || 1
            const offset = req.query.offset || (page - 1) * limit

            const response = await Divisi.getAll(nama, limit, offset)
            const total_data = await Divisi.count()

            return res.status(200).json({ total_data: total_data, data: response})
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    create: async (req, res) => {
        try {
            const { nama_divisi } = req.body

            const response = await Divisi.create(nama_divisi)

            return res.status(201).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    update: async (req, res) => {
        const { id } = req.params
        const { nama_divisi } = req.body

        try {
            const response = await Divisi.update(id, nama_divisi)

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    delete: async (req, res) => {
        const { id } = req.params

        try {
            const response = await Divisi.delete(id)

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = DivisiController