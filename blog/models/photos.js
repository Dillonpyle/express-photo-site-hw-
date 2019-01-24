const mongoose = require('mongoose');

const photoSchema = mongoose.Schema({
    title: {
        type: String
    },
    img: {
        type: String
    },
    about: {
        type: String
    }
})

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;