const express = require('express')
const handlebars = require('express-handlebars') // html 模板套件
const bodyParser = require('body-parser')   // body-parser 套件: 解析 request body
const flash = require('connect-flash') // 快閃訊息 (flash message) 套件
const session = require('express-session') // 自訂訊息並存到 session 裡
const passport = require('./config/passport')
const methodOverride = require('method-override')
const db = require('./models')
const app = express()
const port = 3000


// setup handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' })) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎

// setup bodyParser
app.use(bodyParser.urlencoded({ extended: true }))

// setup session and flash
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))

// setup passport
app.use(passport.initialize())
app.use(passport.session())

app.use(methodOverride('_method'))
app.use(flash())
app.use('/upload', express.static(__dirname + '/upload'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app, passport)

module.exports = app
