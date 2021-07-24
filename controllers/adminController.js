
const db = require('../models')
const Restaurant = db.Restaurant
const fs = require('fs')

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
            fs.readFile(file.path, (err, data) => {
                if (err) console.log('Error', err)
                fs.writeFile(`upload/${file.originalname}`, data, () => {
                    return Restaurant.create({
                        name: req.body.name,
                        tel: req.body.tel,
                        address: req.body.address,
                        opening_hours: req.body.opening_hours,
                        description: req.body.description,
                        image: file ? `/upload/${file.originalname}` : null
                    }).then((restaurant) => {
                        req.flash('success_messages', 'restaurant was successfully created')
                        return res.redirect('/admin/restaurants')
                    })
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
            console.log(restaurant)
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
            fs.readFile(file.path, (err, data) => {
                fs.writeFile(`upload/${file.originalname}`, data, () => {
                    return Restaurant.findByPk(req.params.id)
                        .then((restaurant) => {
                            restaurant.update({
                                name: req.body.name,
                                tel: req.body.tel,
                                address: req.body.address,
                                opening_hours: req.body.opening_hours,
                                description: req.body.description,
                                image: file ? `/upload/${file.originalname}` : restaurant.image
                            }).then((restaurant) => {
                                req.flash('success_messages', 'restaurant was successfully to update')
                                res.redirect('/admin/restaurants')
                            })
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
    }
}

module.exports = adminController
