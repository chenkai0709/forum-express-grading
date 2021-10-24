const express = require('express')
const router = express.Router()

// 引入 multer 並設定上傳資料夾 
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

// 引入passport 策略(for JWT)
const passport = require('../config/passport')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
    if (req.user) {
        if (req.user.isAdmin) { return next() }
        return res.json({ status: 'error', message: 'permission denied' })
    } else {
        return res.json({ status: 'error', message: 'permission denied' })
    }
}

const adminController = require('../controllers/api/adminController.js')
const userController = require('../controllers/api/userController.js')

router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)
router.post('/admin/restaurants', authenticated, authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', authenticated, authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

// JWT signin
router.post('/signin', userController.signIn)

module.exports = router