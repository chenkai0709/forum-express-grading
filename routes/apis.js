const express = require('express')
const router = express.Router()

// 引入 multer 並設定上傳資料夾 
const multer = require('multer')
const upload = multer({ dest: 'temp/' })


const adminController = require('../controllers/api/adminController.js')
const userController = require('../controllers/api/userController.js')

router.get('/admin/restaurants', adminController.getRestaurants)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)

// JWT signin
router.post('/signin', userController.signIn)

module.exports = router