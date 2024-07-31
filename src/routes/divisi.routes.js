const express = require('express')
const router = express.Router()
const DivisiController = require('../controllers/divisi.controller')

router.get('/', DivisiController.getAll)
router.post('/', DivisiController.create)
router.patch('/:id', DivisiController.update)
router.delete('/:id', DivisiController.delete)

module.exports = router