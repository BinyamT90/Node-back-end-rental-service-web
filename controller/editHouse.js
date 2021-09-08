mongoose = require('mongoose');
fs = require('fs');

var multer = require('multer');
var path = require('path');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
var home = mongoose.model('home');
var editHome = mongoose.model('editHome');

const images = require('./readImages')
function editHouse (req, res) {
    dotenv.config();
    var userToken = req.headers['x-access-token'];
    if (!userToken) return res.send("no token provided");


    const decodedEmail = jwt.verify(userToken, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) return res.send('Failed to authenticate');
        /*console.log(req.query.id);*/
        return decoded
    });
    let today = moment();
    const reviewStatus = () =>
    {
        let listingStatus = req.body.params.listingStatus;
        switch (listingStatus) {
            case "Draft":
                return "Na";
            case "Submitted":
                return "Pending";
            case "Active":
                return "Approved";
            case "In-active":
                return "pending";
            case "Cancel Review":
                return "Na";
            case "Update Review":
                return "Pending";
        }
    }
    home.findOne({_id: req.query.id}, function (err, docs) {
        if (err) {
            console.error(err);
        } else {
            if (docs) {
                const getImage = async ()=>{
                    const files =  await images.readImages(docs.ownerEmail, docs._id);
                    const fileDocs = {docs, files}
                    res.send(fileDocs)
                };
                getImage()

            } else {
                editHome.findOne({_id: req.query.id}, function (err, editedDocs) {
                    if (err) {
                        console.error(err)
                    } else {
                        const getImage = async ()=>{
                            const files =  await images.readImages(editedDocs.ownerEmail, editedDocs._id);
                            const fileDocs = {docs:editedDocs, files}
                            res.send(fileDocs)
                        };
                        getImage()
                    }
                })
            }
        }
    })


};

module.exports = editHouse;