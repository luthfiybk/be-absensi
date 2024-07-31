const express = require('express')
const router = express.Router()
const PresensiController = require('../controllers/presensi.controller')

router.get('/', PresensiController.getAll)
router.get('/:id', PresensiController.getById)
router.post('/masuk', PresensiController.presensiMasuk)

module.exports = router