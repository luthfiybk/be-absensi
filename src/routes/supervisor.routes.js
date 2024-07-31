const express = require('express')
const router = express.Router()
const SupervisorController = require('../controllers/supervisor.controller')
const auth = require('../middleware/auth')

router.get('/', auth, SupervisorController.dashboard)
router.get('/karyawan', auth, SupervisorController.getKaryawan)
router.get('/izin', auth, SupervisorController.getIzin)
router.get('/presensi', auth, SupervisorController.getPresensi)

module.exports = router