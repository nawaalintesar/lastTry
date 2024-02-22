const express = require('express')

// controller functions
const { loginUser, signupUser,     updateAccountInfo,    getAccountInfo, deleteAccount } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')
const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

router.patch('/update', requireAuth, updateAccountInfo)

// GET a single project
router.get('/', requireAuth, getAccountInfo)

router.delete('/', requireAuth, deleteAccount)
module.exports = router