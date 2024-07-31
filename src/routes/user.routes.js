const PresensiController = require('../controllers/presensi.controller')
const UserController = require('../controllers/user.controller')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

router.get('/all', UserController.getAll)
router.get('/:no_karyawan', UserController.getByNoKaryawan)
router.post('/create', UserController.create)
router.put('/:nip', UserController.update)
router.delete('/:nip', UserController.delete)
router.get('/presensi/check', auth, PresensiController.check)

module.exports = router