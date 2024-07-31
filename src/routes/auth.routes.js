const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth.controller')
const auth = require('../middleware/auth')

router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)
router.get('/session', auth, AuthController.fetchData)

module.exports = router