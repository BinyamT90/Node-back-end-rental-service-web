var express = require('express');
var router = express.Router();
mongoose = require('mongoose');
homepage = require('../controller/homepage');
signup = require('../controller/signup');
loginUser = require('../controller/login');
addhouse = require('../controller/addhouse');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/homepage', homepage);
router.post('/loginUser', loginUser);
router.post('/signUpUser', signup);
router.post('/addhouse', addhouse.addNewListing);
router.post('/uploadHouseImage', addhouse.uploadProductImage);



module.exports = router;
