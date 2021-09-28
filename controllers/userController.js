const bcrypt = require('bcryptjs') // bcryptjs 套件: 加密演算法
const db = require('../models')
const User = db.User
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const restaurant = require('../models/restaurant')
const user = require('../models/user')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_IcD

const userController = {
    signUpPage: (req, res) => {
        return res.render('signup')
    },
    signUp: (req, res) => {
        // confirm password
        if (req.body.passwordCheck != req.body.password){
            req.flash('error_messages', '兩次密碼輸入不同！')
            return res.redirect('/signup')
        } else {
            // confirm unique user
            User.findOne({where: {email: req.body.email}}).then(user => {
                if (user){
                    req.flash('error_messages', '信箱重複！')
                    return res.redirect('/signup')
                } else {
                    User.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                    }).then(user => {
                        req.flash('success_messages', '成功註冊帳號！')
                        return res.redirect('/signin')
                    })
                }
            })
        }
    },
    signInPage: (req, res) => {
        return res.render('signin')
    },
    signIn: (req, res) => {
        req.flash('success_messages', '成功登入')
        res.redirect('/restaurants')
    },
    logout: (req, res) => {
        req.flash('success_messages', '登出成功')
        req.logout()
        res.redirect('/signin')
    },
    getUser: (req, res) => {
        return User.findByPk(req.params.id)
            .then(user => {
                return res.render('user', {
                    user: user.toJSON()
                })
            })
    },
    editUser: (req, res) => {
        return User.findByPk(req.params.id)
            .then(user => {
                return res.render('userEdit', {
                    user: user.toJSON()
                })
            })
    },
    putUser: (req, res) => {
        console.log('req +', req)
        if (!req.body.name) {
            req.flash('error_messages', "name didn't exist")
            return res.redirect('back')
        }

        const { file } = req
        if (file) {
            console.log('file', file)
            imgur.setClientID(IMGUR_CLIENT_ID);
            imgur.upload(file.path, (err, img) => {
                return User.findByPk(req.params.id)
                    .then((user) => {
                        user.update({
                            name: req.body.name,
                            email: req.body.email,
                            image: file ? img.data.link : user.image
                        }).then((user) => {
                            res.render('user', {
                                user: user.toJSON()
                            })
                        })
                    })
            })
        } else {
            return User.findByPk(req.params.id)
                .then((user) => {
                    user.update({
                        name: req.body.name,
                        email: req.body.email,
                        image: user.image
                    }).then((restaurant) => {
                        res.render('user', {
                            user: user.toJSON()
                        })
                    })
                })
        }
    },
    // 我的最愛
    addFavorite: (req, res) => {
        return Favorite.create({
            UserId: req.user.id,
            RestaurantId: req.params.restaurantId
        }).then((restaurant) => {
            return res.redirect('back')
        })
    },
    removeFavorite: (req, res) => {
        return Favorite.findOne({
            where: {
                UserId: req.user.id,
                RestaurantId: req.params.restaurantId
            }
        })
            .then((favorite) => {
                favorite.destory()
                    .then((restaurant) => {
                        return res.redirect('back')
                    })
            })
    },

    // 餐廳收藏
    addLike: (req, res) => {
        return Like.create({
            UserId: req.user.id,
            RestaurantId: req.params.restaurantId
        })
            .then((restaurant) => {
                return res.redirect('back')
            })
    },
    removeLike: (req, res) => {
        return Like.findOne({
            where: {
                UserId: req.user.id,
                RestaurantId: req.params.restaurantId
            }
        })
            .then((like) => {
                like.destory()
                    .then((restaurant) => {
                        return res.redirect('back')
                    })
            })
    },

    // 美食達人
    getTopUser: (req, res) => {
        return User.findAll({
            include: [
                { model: User, as: 'Followers' }
            ]
        }).then(users => {
            users = users.map(user => ({
                ...user.dataValues,
                FollowerCount: user.Followers.length,
                isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
            }))
            users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
            return res.render('topUser', { users: users })
        })
    },
    addFollowing: (req, res) => {
        return Followship.create({
            followerId: req.user.id,
            followingId: req.params.userId
        })
            .then((followship) => {
                return res.redirect('back')
            })
    },
    removeFollowing: (req, res) => {
        return Followship.findOne({where: {
            followerId: req.user.id,
            followingId: req.params.userId
        }})
            .then((followship) => {
                followship.destory()
                    .then((followship) => {
                        return res.redirect('back')
                    })
            })
    }

}

module.exports = userController