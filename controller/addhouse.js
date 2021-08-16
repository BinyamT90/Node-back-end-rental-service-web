mongoose = require('mongoose');
fs = require('fs');

var multer = require('multer');
var path = require('path');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');


var productIdHashed = '';

var user = mongoose.model('user');
var home = mongoose.model('home');




module.exports.addNewListing = function (req, res) {
    dotenv.config();
    var userToken = req.headers['x-access-token'];
    if (!userToken) return res.send("no token provided");

    const decodedEmail = jwt.verify(userToken, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) return res.send('Failed to authenticate');
        console.log(decoded);
        console.log(req.body.params);
        return decoded
    });
    user.findOne({email: decodedEmail}, function (err, docs) {
        home.create({
            ownerEmail: docs.email,
            ownerName: docs.name,
            location: req.body.params.location,
            bed_room : req.body.params.bedRoom,
            monthly_payment: req.body.params.monthlyPayment,
            floor: req.body.params.floor,
            phone_number: req.body.params.phoneNumber,
            guest_house : false,
            description : req.body.params.description,
            dateCreated: moment()
        }, function (err, houseDocs) {
            const encodedId = jwt.sign(`${houseDocs._id}`, process.env.TOKEN_SECRET);
            /*console.log(houseDocs._id + " This is The ID");*/
            home.updateOne({_id: houseDocs._id}, {encodedImageUrl: encodedId}, function (err, found) {
                if (err) {
                    /*console.log("This is happening " + err)*/
                }
                productIdHashed = `${houseDocs._id}`;

                /*console.log("found");*/

                res.send(houseDocs);

            });


        })
    })

};


module.exports.uploadProductImage = function (req, res) {

    var i = 0;
    console.log('what');
    const encodedId = jwt.sign(productIdHashed, process.env.TOKEN_SECRET);
    console.log(process.env.TOKEN_SECRET, encodedId);

    var storage = multer.diskStorage({


        destination: './public/images/products/',
        filename: function (req, file, cb) {

            // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            i = i + 1;
            /*console.log(path.extname(file.originalname));*/

            /*cb(null, i + path.extname(file.originalname));*/
            cb(null, encodedId + path.extname((file.originalname)))

        }
    });

    var upload = multer({
        i: 2,
        storage: storage,
        limits: {fileSize: 10000000},


    }).single('file');


    upload(req, res, function (err) {
        if (err) {
            /*console.log("error");*/
            /*console.log(err);*/
        } else {
            /*console.log(req.file);*/
            /*console.log("File has been uploaded");*/

            res.send("Success");
        }
    });

};





