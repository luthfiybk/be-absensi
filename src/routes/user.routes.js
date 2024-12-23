const PresensiController = require('../controllers/presensi.controller')
const IzinController = require('../controllers/izin.controller')
const UserController = require('../controllers/user.controller')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

router.get('/all', auth, UserController.getAll)
router.get('/:no_karyawan', UserController.getByNoKaryawan)
router.post('/create', UserController.create)
router.put('/:nip', UserController.update)
router.delete('/:nip', UserController.delete)
router.get('/presensi/check', auth, PresensiController.check)
router.get('/izin/check', auth, IzinController.check)

module.exports = router