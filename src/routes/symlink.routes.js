const express = require('express')
const router = express.Router()
const SymlinkController = require('../controllers/symlink.controller')

router.get('/file/:filename', SymlinkController.getFile)
router.get('/photo/:filename', SymlinkController.getPhoto)

module.exports = router