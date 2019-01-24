const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Photo = require('../models/photos');

//index users
router.get('/', (req, res) => {
    User.find({}, (err, allUsers) => {
        res.render('users/index.ejs', {
            users: allUsers
        });
    });
});

//create
router.get('/new', (req, res) => {
    res.render('users/new.ejs')
});

router.post('/', (req, res) => {
    console.log('req.body', req.body)
    User.create(req.body, (err, createdUser) => {
        if (err) {
            res.send(err)
        } else {
            console.log(createdUser);
            res.redirect('/users')
        }
    });
});

//show
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        console.log(`foundUser ${foundUser}`)
        if (err) {
            res.send(err)
        } else {
            res.render('users/show.ejs', {
                user: foundUser
            });
        }
    });
});

//edit
router.get('/:id/edit', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        res.render('users/edit.ejs', {
            user: foundUser
        })
    })
})


router.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    }, (err, updatedUser) => {
        if (err) {
            res.send(err);
        } else {
            console.log(updatedUser);
            res.redirect('/users')
        }
    })
})

//delete
router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, deletedUser) => {
        const photoIds = [];
        for (let i = 0; i < deletedUser.photos.length; i++) {
            photoIds.push(deletedUser.photos[i]._id);
        }

        Photo.deleteMany({
                _id: {
                    $in: photoIds
                }
            },
            (err, data) => {
                console.log(`data ${data}`)
                console.log(`deleted ${deletedUser}`);
                res.redirect('/users');
            }
        )
    });
});


module.exports = router;