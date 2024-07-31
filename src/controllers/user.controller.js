const User = require('../models/User')
const bcrypt = require('bcryptjs')

const UserController = {
    getAll: async (req, res) => {
        try {
            const search = req.query.search || ''
            const limit = req.query.limit || 10
            const page = req.query.page || 1
            const offset = req.query.offset || (page - 1) * limit
            const roleId = req.query.role || null
            const divisiId = req.query.division || null

            const response = await User.getAll(search, limit, offset, roleId, divisiId)

            const total_users = await User.count()

            res.status(200).json({ message: 'success', total_data: total_users , data: response })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    getByNoKaryawan: async (req, res) => {
        try {
            const no_karyawan = req.params.no_karyawan

            const response = await User.getByNoKaryawan(no_karyawan)

            res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    create: async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const data = {
                no_karyawan: req.body.no_karyawan,
                nama: req.body.nama,
                email: req.body.email,
                password: hashedPassword,
                roleId: req.body.roleId,
                divisiId: req.body.divisiId || null
            }

            const response = await User.create(data.no_karyawan, data.nama, data.email, data.password, data.roleId, data.divisiId)

            return res.status(201).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    update: async (req, res) => {
        try {
            const nip = req.params.nip
            const data = {
                nama: req.body.nama,
                email: req.body.email,
                roleId: req.body.roleId,
                divisiId: req.body.divisiId || null
            }

            const response = await User.update(nip, data)

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    

    delete: async (req, res) => {
        try {
            const nip = req.params.nip

            const response = await User.delete(nip)

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = UserController