const Izin = require('../models/Izin')
const jwt = require('jsonwebtoken')
const {formatISO} = require('date-fns/formatISO')
const moment = require('moment-timezone')

const IzinController = {
    getAll: async (req, res) => {
        try {
            const nama = req.query.search || ''
            const date = req.query.date || ''
            const statusId = req.query.status || null
            const divisiId = req.query.division || null
            const limit = req.query.limit || 10
            const page = req.query.page || 1
            const offset = req.query.offset || (page - 1) * limit

            const response = await Izin.getAll(nama, date, statusId, divisiId, limit, offset)

            const total_izin = await Izin.count()

            return res.status(200).json({ total_data: total_izin, data: response })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    applyIzin: async (req, res) => {
        try {
            const no_karyawan = req.decodedToken.no_karyawan
            const statusId = 4
            const keterangan = req.body.keterangan
            const file = req.file

            const data = {
                tanggal: formatISO(new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }), { representation: 'basic' }),
                statusId: statusId,
                keterangan: keterangan,
                file: file.filename,
                no_karyawan: no_karyawan
            }

            const response = await Izin.applyIzin(data)

            return res.status(201).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    getById: async (req, res) => {
        try {
            const izinId = req.params.id
            const response = await Izin.getById(izinId)
            const fileUrl = `${process.env.BASE_URL}/api/symlink/file/${response[0].file}`
            response[0].file_link = fileUrl

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    approveIzin: async (req, res) => {
        try {
            if (req.decodedToken.roleId === 3 || req.decodedToken.roleId === 1) {
                const izinId = req.params.id
                const statusId = 5
    
                const response = await Izin.updateIzin(izinId, statusId)
    
                return res.status(200).json(response)
            } else {
                return res.status(403).json({ message: "Forbidden" })
            }
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    rejectIzin: async (req, res) => {
        try {
            if(req.decodedToken.roleId === 3 || req.decodedToken.roleId === 1) {
                const izinId = req.params.id
                const statusId = 6
    
                const response = await Izin.updateIzin(izinId, statusId)
    
                return res.status(200).json(response)
            
            } else {
                return res.status(403).json({ message: "Forbidden" })
            }
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    updateIzin: async (req, res) => {
        try {
            const izinId = req.params.id
            const statusId = req.body.statusId

            const response = await Izin.updateIzin(izinId, statusId)

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    rekapIzin: async (req, res) => {
        let token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized - Missing Token" });
        }

        const decodedToken = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);

        if (!decodedToken || !decodedToken.no_karyawan) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        try {
            const no_karyawan = decodedToken.no_karyawan
            const limit = req.query.limit || 10
            const page = req.query.page || 1
            const offset = req.query.offset || (page - 1) * limit

            const response = await Izin.rekapIzin(no_karyawan, limit, offset)
            const mappedResponse = response.map((item) => {
                return {
                    ...item
                }
            })

            const total_izin = await Izin.countRekapIzin(no_karyawan)

            return res.status(200).json({ total_data: parseInt(total_izin[0].total), data: mappedResponse })
        } catch (error) {
            console.log('cek')
            return res.status(500).json({ message: error.message })
        }
    },

    check: async (req, res) => {
        try {
            const nip = req.decodedToken.nip
            const tanggal = moment().tz('Asia/Jakarta').format('YYYY-MM-DD')

            const response = await Izin.check(nip, tanggal)

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = IzinController