const { json } = require('body-parser')
const Admin = require('../models/Admin')
const moment = require('moment-timezone')

const AdminController = {
    dashboard: async (req, res) => {
        try {
            const tanggal = moment.tz('Asia/Jakarta').format('YYYY-MM-DD')
            const response = await Admin.dashboard(tanggal)

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({error: error.message})
        }
    }
}

module.exports = AdminController