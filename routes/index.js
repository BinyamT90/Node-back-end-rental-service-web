var express = require('express');
var router = express.Router();
mongoose = require('mongoose');
search = require('../controller/search');
homepage = require('../controller/homepage');
detail = require('../controller/detail');
adminDetail = require('../controller/adminDetail');
signup = require('../controller/signup');
loginUser = require('../controller/login');
addhouse = require('../controller/addhouse');
editHouse = require('../controller/editHouse');
dashboard = require('../controller/dashboard');

adminChangeStatus = require('../controller/adminChangeStatus');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search', search);
router.get('/homepage', homepage);
router.get('/detail', detail);
router.get('/adminDetail', adminDetail);
router.post('/loginUser', loginUser);
router.post('/signUpUser', signup);
router.post('/addhouse', addhouse.addNewListing);
router.post('/uploadHouseImage', addhouse.uploadProductImage);
router.post('/editHouseUpdate', addhouse.editHouseUpdate);
router.get('/edithouse', editHouse);
router.get('/dashboard', dashboard);

router.post('/changeHomeStatus', adminChangeStatus);


module.exports = router;
