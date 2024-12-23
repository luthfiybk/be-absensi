const express = require('express')
const router = express.Router()
const PresensiController = require('../controllers/presensi.controller')
const auth = require('../middleware/auth')

router.get('/', PresensiController.getAll)
router.get('/rekap', PresensiController.rekapPresensi)
router.get('/:id', PresensiController.getById)
router.post('/masuk', PresensiController.presensiMasuk)
router.put('/pulang', PresensiController.presensiPulang)

module.exports = router