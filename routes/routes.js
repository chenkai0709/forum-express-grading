
const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')

const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const authenticated = (req, res, next) => {
    // if (req.isAuthenticated()) {
    if (helpers.ensureAuthenticated(req)) {
        return next()
    }
    res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
    // if (req.isAuthenticated()) {
    if (helpers.ensureAuthenticated(req)) {
        // if (req.user.isAdmin) {
        if (helpers.getUser(req).isAdmin) {
            return next()
        }
        return res.redirect('/')
    }
    res.redirect('/signin')
}

router.get('/', authenticated, (req, res) => { res.redirect('/restaurants') })

//  前台
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

// 後台
router.get('/admin', authenticatedAdmin, (req, res) => { res.redirect('/admin/restaurants') })

// 使用者權限
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

// 餐廳瀏覽
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
// 最新動態
// 餐廳新增
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
// 餐廳明細
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
// 餐廳更新
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
// 餐廳刪除
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

// 使用者註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// 登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }),
    userController.signIn)
router.get('/logout', userController.logout)

// 分類
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

// 評論
router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

// 美食達人
router.get('/users/top', authenticated, userController.getTopUser)
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

// 個人資料
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

// 我的最愛
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// 餐廳收藏
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

module.exports = router