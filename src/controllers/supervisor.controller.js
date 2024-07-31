const Supervisor = require('../models/Supervisor')
const moment = require('moment-timezone')
const jwt = require('jsonwebtoken')

const SupervisorController = {
    dashboard: async (req, res) => {
        try {
            const divisiId = req.decodedToken.divisiId
            const tanggal = moment.tz('Asia/Jakarta').format('YYYY-MM-DD')
            const response = await Supervisor.dashboard(divisiId, tanggal)

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },

    getKaryawan: async (req, res) => {
        try {
            const divisiId = req.decodedToken.divisiId
            const nama = req.query.search || ''
            const limit = Number(req.query.limit) || 10
            const page = Number(req.query.page) || 1
            const offset = req.query.offset || (page - 1) * limit

            const response = await Supervisor.getKaryawan(divisiId, nama, limit, offset)
            const total_data = await Supervisor.countKaryawan(divisiId, nama)

            return res.status(200).json({ total_data: parseInt(total_data[0].total_data), data: response })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },

    getIzin: async (req, res) => {
        try {
            const divisiId = req.decodedToken.divisiId

            const nama = req.query.search || ''
            const tanggal = req.query.date || ''
            const statusId = req.query.status || null
            const limit = Number(req.query.limit) || 10
            const page = Number(req.query.page) || 1
            const offset = req.query.offset || (page - 1) * limit

            const response = await Supervisor.getIzin(divisiId, nama, tanggal, statusId, limit, offset)
            const total_data = await Supervisor.countIzin(divisiId, nama, tanggal, statusId)

            return res.status(200).json({ total_data: parseInt(total_data[0].total_data), data: response })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },

    getPresensi: async (req, res) => {
        try {
            const divisiId = req.decodedToken.divisiId

            const nama = req.query.search || ''
            const status = req.query.status || null
            const date = req.query.date || ''
            const limit = Number(req.query.limit) || 10
            const page = Number(req.query.page) || 1
            const offset = req.query.offset || (page - 1) * limit

            const response = await Supervisor.getPresensi(divisiId, nama, date, status, limit, offset)
            const mappedResponse = response.map((item) => {
                return{
                    ...item,
                    tanggal: moment(item.tanggal).tz('Asia/Jakarta').format('YYYY-MM-DD'),
                    jamMasuk: moment(item.jamMasuk).tz('Asia/Jakarta').format('HH:mm:ss')
                }
            })

            const total_data = await Supervisor.countPresensi(divisiId, nama, date, status)

            return res.status(200).json({ total_data: parseInt(total_data[0].total_data), data: mappedResponse })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
}

module.exports = SupervisorController