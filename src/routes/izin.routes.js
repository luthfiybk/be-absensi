const express = require('express')
const router = express.Router()
const IzinController = require('../controllers/izin.controller')
const upload = require('../helpers/uploadThing')
const auth = require('../middleware/auth')

router.get('/', IzinController.getAll)
router.post('/apply', upload.single('file'), auth,  IzinController.applyIzin)
router.get('/:id', IzinController.getById)
router.put('/:id/approve', auth, IzinController.approveIzin)
router.put('/:id/reject', auth, IzinController.rejectIzin)
router.put('/:id', IzinController.updateIzin)

module.exports = router