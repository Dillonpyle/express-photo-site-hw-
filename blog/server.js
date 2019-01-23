const express = require('express');
const app = express();
require('./db/db');

const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const usersController = require('./controllers/users');

//middleware
app.use(express.static(__dirname + '/public'));
//app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', (req, res) => {
    res.render('index.ejs');
});



//routes
app.use('/users', usersController);

app.listen(3000, () => {
    console.log('working on port 3000');
});