const express = require('express');
const router = express.Router();
const Photo = require('../models/photos');
const User = require('../models/users');

//index route
router.get('/', (req, res) => {
    Photo.find({}, (err, foundPhotos) => {
        if (err) {
            res.send(err)
        } else {
            res.render('photos/index.ejs', {
                photos: foundPhotos
            });
        }
    });
});

//create route
router.get('/new', (req, res) => {
    User.find({}, (err, allUsers) => {
        console.log(allUsers)
        res.render('photos/new.ejs', {
            users: allUsers
        });
    });
});

router.post('/', (req, res) => {
    console.log(req.body)

    User.findById(req.body.userId, (err, foundUser) => {
        Photo.create(req.body, (err, createdPhoto) => {
            if (err) {
                res.send(err);
            } else {
                foundUser.photos.push(createdPhoto);
                foundUser.save((err, data) => {
                    res.redirect('/photos')
                });
            }
        });
    });
});

//show
router.get('/:id', (req, res) => {
    Photo.findById(req.params.id, (err, foundPhoto) => {
        console.log(`foundPhoto ${foundPhoto}`)
        User.findOne({
            'photos._id': req.params.id
        }, (err, foundUser) => {
            console.log(`foundUser ${foundUser}`)
            if (err) {
                res.send(err);
            } else {
                res.render('photos/show.ejs', {
                    photo: foundPhoto,
                    user: foundUser
                });
            }
        })
    });
});

//edit route
router.get('/:id/edit', (req, res) => {
    Photo.findById(req.params.id, (err, foundPhoto) => {

        User.find({}, (err, allUsers) => {
            // Finding the author that wrote the article we are trying to edit
            User.findOne({
                'photos._id': req.params.id
            }, (err, photoUser) => {

                if (err) {
                    res.send(err);
                } else {
                    res.render('photos/edit.ejs', {
                        photo: foundPhoto,
                        users: allUsers,
                        photoUser: photoUser
                    });
                }
            });
        });
    });
});

router.put('/:id', (req, res) => {

    Photo.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    }, (err, updatedPhoto) => {

        User.findOne({
            'photos._id': req.params.id
        }, (err, foundUser) => {
            console.log(foundUser)
            foundUser.photos.id(req.params.id).remove();
            foundUser.photos.push(updatedPhoto);
            foundUser.save((err, data) => {
                res.redirect('/photos/' + req.params.id)
            });
        });
    });
});






//delete route
router.delete('/:id', (req, res) => {
    Photo.findByIdAndRemove(req.params.id, (err, deletedPhoto) => {
        console.log(`deleted photo ${deletedPhoto}`)
        User.findOne({
            'photos._id': req.params.id
        }, (err, foundUser) => {

            foundUser.photos.id(req.params.id).remove();

            foundUser.save((err, data) => {
                if (err) {
                    res.send(err);
                    console.log(`foundUser.photos ${foundUser.photos}`)
                } else {
                    res.redirect('/photos');
                }
            });
        });
    });
});

module.exports = router;