
const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')

module.exports = (app, passport) => {
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

  app.get('/', authenticated, (req, res) => { res.redirect('/restaurants') })
  app.get('/restaurants', authenticated, restController.getRestaurants)

  // 後台
  app.get('/admin', authenticatedAdmin, (req, res) => { res.redirect('/admin/restaurants') })

  // 使用者權限
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

  // 餐廳瀏覽
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

  // 餐廳新增
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

  // 餐廳明細
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

  // 餐廳更新
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

  // 餐廳刪除
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  // 使用者註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  // 登入
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }),
        userController.signIn)
  app.get('/logout', userController.logout)
  
}
