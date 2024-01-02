const express = require('express')
const router = express.Router()
const { getHomepage, PostLoginUser, RouterToken, LogoutToken, CreareClient, CreateUser } = require('../controllers/homecontroller')
const { CreateBooks, UpdateBook } = require('../controllers/book')
const verifyToken = require('../auth')


router.get('/', getHomepage)
router.post('/login', PostLoginUser)
router.get('/role', verifyToken, (req, res) => {
    res.json(res.locals.user)
})
router.post('/token', RouterToken)
router.delete('/logout', verifyToken, LogoutToken)
router.post('/create1', CreareClient)
router.post('/create2', verifyToken, CreateUser)
router.post('/createbook', verifyToken, CreateBooks)
router.post('/updateBook', verifyToken, UpdateBook)
module.exports = router