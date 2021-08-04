
const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const fs = require('fs')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
    // 瀏覽
    getRestaurants: (req, res) => {
        return Restaurant.findAll({ raw: true }).then(restaurants => {
            return res.render('admin/restaurants', { restaurants: restaurants })
        })
    },
    // 新增
    createRestaurant: (req, res) => {
        return res.render('admin/create')
    },
    postRestaurant: (req, res) => {
        if (!req.body.name) {
            req.flash('error_messages', "name didn't exist")
            return res.redirect('back')
        }

        const { file } = req
        if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID);
            imgur.upload(file.path, (err, img) => {
                return Restaurant.create({
                    name: req.body.name,
                    tel: req.body.tel,
                    address: req.body.address,
                    opening_hours: req.body.opening_hours,
                    description: req.body.description,
                    image: file ? img.data.link : null
                }).then((restaurant) => {
                    req.flash('success_messages', 'restaurant was successfully created')
                    return res.redirect('/admin/restaurants')
                })
            })
        } else {
            return Restaurant.create({
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                opening_hours: req.body.opening_hours,
                description: req.body.description,
                image: null
            }).then((restaurant) => {
                req.flash('success_messages', 'restaurant was successfully created')
                return res.redirect('/admin/restaurants')
            })
        }
    },
    // 明細
    getRestaurant: (req, res) => {
        return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
            return res.render('admin/restaurant', { restaurant: restaurant })
        })
    },
    // 更新
    editRestaurant: (req, res) => {
        return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
            return res.render('admin/create', { restaurant: restaurant })
        })
    },
    putRestaurant: (req, res) => {
        if (!req.body.name) {
            req.flash('error_messages', "name didn't exist")
            return res.redirect('back')
        }

        const { file } = req
        if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID);
            imgur.upload(file.path, (err, img) => {
                return Restaurant.findByPk(req.params.id)
                    .then((restaurant) => {
                        restaurant.update({
                            name: req.body.name,
                            tel: req.body.tel,
                            address: req.body.address,
                            opening_hours: req.body.opening_hours,
                            description: req.body.description,
                            image: file ? img.data.link : restaurant.image
                        }).then((restaurant) => {
                            req.flash('success_messages', 'restaurant was successfully to update')
                            res.redirect('/admin/restaurants')
                        })
                    })
            })
        } else {
            return Restaurant.findByPk(req.params.id)
                .then((restaurant) => {
                    restaurant.update({
                        name: req.body.name,
                        tel: req.body.tel,
                        address: req.body.address,
                        opening_hours: req.body.opening_hours,
                        description: req.body.description,
                        image: restaurant.image
                    }).then((restaurant) => {
                        req.flash('success_messages', 'restaurant was successfully to update')
                        res.redirect('/admin/restaurants')
                    })
                })
        }
    },
    // 刪除
    deleteRestaurant: (req, res) => {
        return Restaurant.findByPk(req.params.id)
            .then((restaurant) => {
                restaurant.destroy()
                    .then((restaurant) => { res.redirect('/admin/restaurants') })
            })
    },

    // 作業 : 後台瀏覽使用者清單
    getUsers: (req, res) => {
        return User.findAll({ raw: true }).then(users => {
            return res.render('admin/users', { users: users })
        })
    },

    toggleAdmin: (req, res) => {
        return User.findByPk(req.params.id)
                .then((user) => {
                    user.update({
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        isAdmin: !user.isAdmin
                    }).then((user) => {
                        res.redirect('back')
                    })
                })
    }
}

module.exports = adminController
