const Presensi = require('../models/Presensi')
const jwt = require('jsonwebtoken')
const { formatISO } = require('date-fns/formatISO')
const moment = require('moment-timezone')
const { format } = require('date-fns')
const Titik = require('../models/Titik')
const { check } = require('prisma')
const path = require('path')
const fs = require('fs')

const PresensiController = {
    getAll: async (req, res) => {
        try {
            const nama = req.query.search || ''
            const date = req.query.date || ''
            const status = req.query.status || null
            const divisi = req.query.division || null
            const limit = req.query.limit || 10
            const page = req.query.page || 1
            const offset = req.query.offset || (page - 1) * limit

            console.log(status)
            const response = await Presensi.getAll(nama, date, status, divisi, limit, offset)

            const mappedResponse = response.map((item) => {
                return {
                    ...item,
                    jamMasuk: moment(item.jamMasuk).tz('Asia/Jakarta').format('HH:mm:ss'),
                    jamPulang: moment(item.jamPulang).tz('Asia/Jakarta').format('HH:mm:ss'),
                }
            
            })

            const total_presensi = await Presensi.count()

            return res.status(200).json({ total_data: total_presensi, data: mappedResponse })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    getByNIP: async (req, res) => {
        try {
            const userId = req.session.userId
            
            const response = await Presensi.getByNIP(userId)

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    
    presensiMasuk: async (req, res) => {
        let token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized - Missing Token" });
        }

        const decodedToken = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);

        if (!decodedToken || !decodedToken.no_karyawan) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        try {
            const no_karyawan = decodedToken.no_karyawan;
            const latitude = parseFloat(req.body.latitude);
            const longitude = parseFloat(req.body.longitude);
            const photo = req.body.photo;
            const jam = moment.tz('Asia/Jakarta').format('HH');
            const menit = moment.tz('Asia/Jakarta').format('mm');
            const detik = moment.tz('Asia/Jakarta').format('ss');

            console.log(latitude, longitude)
    
            const near_titik = await Titik.getNearest(latitude, longitude);

            if (near_titik.length > 0) {
                let status_id;
    
                if (parseInt(jam) >= 8 && parseInt(jam) <= 9) {
                    status_id = 1;
                } else if (parseInt(jam) > 9 && parseInt(jam) <= 12) {
                    status_id = 2;
                } else {
                    status_id = 3;
                }
    
                const tanggal = formatISO(new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }), { representation: 'basic' });
                const jamMasuk = formatISO(new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }), { representation: 'basic' });
    
                const imageFolder = path.join(__dirname, '../../public/uploads/presensi');
                let filename = '';
    
                if (photo) {
                    // Menghapus prefix base64 data URL
                    const base64Data = photo.replace(/^data:image\/jpeg;base64,/, "");
                    filename = `image-${Date.now()}.png`;
                    const filepath = path.join(imageFolder, filename);
    
                    // Menyimpan file gambar
                    fs.writeFile(filepath, base64Data, 'base64', async (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send("Gagal menyimpan gambar");
                        }
                        const imageUrl = `/presensi/${filename}`;
                        
                        // Data presensi yang akan disimpan ke database
                        const data = {
                            latitude: latitude,
                            longitude: longitude,
                            photo: filename,
                            tanggal: tanggal,
                            jamMasuk: jamMasuk,
                        };
                        
                        try {
                            const response = await Presensi.presensiMasuk(no_karyawan, data, status_id);
                            console.log(response, 'response');
                            return res.status(201).json({ message: "Presensi berhasil", imageUrl, response });
                        } catch (dbError) {
                            console.error(dbError);
                            return res.status(500).send("Gagal menyimpan data presensi ke database");
                        }
                    });
                } else {
                    res.status(400).send("Gambar tidak ditemukan");
                }
            } else {
                res.status(400).send("Lokasi presensi tidak valid");
            }
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    presensiPulang: async (req, res) => {
        try {
            const jamPulang = formatISO(new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }), { representation: 'basic' });
            const no_karyawan = req.decodedToken.no_karyawan;

            const response = await Presensi.presensiPulang(no_karyawan, jamPulang)

            return res.status(201).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    check: async (req, res) => {
        try {
            const nip = req.decodedToken.nip
            const tanggal = moment().tz('Asia/Jakarta').format('YYYY-MM-DD')

            const response = await Presensi.check(nip, tanggal)

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    setAlpha: (req, res) => {
        try {
            const fetchUser = Presensi.getByDate(new Date(), null)
            
            if(!fetchUser) {
                const response = Presensi.setAlpha()
                
                return res.status(201).json(response)
            }

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params

            const response = await Presensi.getById(id)
            const photoUrl = `${process.env.BASE_URL}/api/symlink/photo/${response[0].photo}`
            response[0].photo_link = photoUrl


            const mappedResponse = response.map((item) => {
                return {
                    ...item,
                    tanggal: moment(item.tanggal).tz('Asia/Jakarta').format('YYYY-MM-DD'),
                    jamMasuk: moment(item.jamMasuk).tz('Asia/Jakarta').format('HH:mm:ss'),
                    jamPulang: moment(item.jamPulang).tz('Asia/Jakarta').format('HH:mm:ss')
                }
            })

            return res.status(200).json(mappedResponse)
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },

    rekapPresensi: async (req, res) => {
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

            const response = await Presensi.rekapPresensi(no_karyawan, limit, offset)

            const mappedResponse = response.map((item) => {
                return {
                    ...item,
                    jamMasuk: moment(item.jamMasuk).tz('Asia/Jakarta').format('HH:mm:ss'),
                }
            })

            const total_presensi = await Presensi.countRekapPresensi(no_karyawan)

            return res.status(200).json({ data: mappedResponse, total_data: parseInt(total_presensi[0].total) })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = PresensiController