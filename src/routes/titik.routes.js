const express = require('express')
const router = express.Router()
const TitikController = require('../controllers/titik.controller')

router.get('/', TitikController.getAll)
router.post('/', TitikController.add)
router.patch('/:id', TitikController.update)
router.delete('/:id', TitikController.delete)

module.exports = router