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
var editHome = mongoose.model('editHome');




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
            listingStatus: req.body.params.listingStatus,
            reviewStatus: req.body.params.reviewStatus,
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

module.exports.editHouseUpdate = function (req, res){
    dotenv.config();
    var userToken = req.headers['x-access-token'];
    if (!userToken) return res.send("no token provided");

    const decodedEmail = jwt.verify(userToken, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) return res.send('Failed to authenticate');
        return decoded
    });
    let today = moment();
    const reviewStatus = () => {
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
    };

    const isTheSame = (toBeUpdatedProduct, editedFields) => {

        if (toBeUpdatedProduct.productName !== editedFields.name ||
            toBeUpdatedProduct.productDescription !== editedFields.description ||
            toBeUpdatedProduct.productCategory !== editedFields.category ||
            toBeUpdatedProduct.productPrice !== editedFields.price ||
            toBeUpdatedProduct.productCommission !== editedFields.commission ||
            toBeUpdatedProduct.productVendorName !== editedFields.vendorName ||
            moment(toBeUpdatedProduct.productLaunchDate).format('DD-MM-YYYY') !== moment(editedFields.LaunchDate).format('DD-MM-YYYY') ||
            toBeUpdatedProduct.productNetwork !== editedFields.Network ||
            toBeUpdatedProduct.noteToReviewer !== editedFields.noteToReviewer) {
            return false
        } else {
            return true
        }

    };

    editHome.findOne({$or: [{originalId: req.body.params.originalId}, {_id: req.body.params.originalId}]}, function (err, toBeUpdatedProduct) {
        if (err) {
            console.error(err)
        } else {
            const checkIfchanged = () => {
                let editedFields = req.body.params;
//lf To be updated

                if (editedFields.reviewStatus === "Pending") {
                    if (toBeUpdatedProduct) {
                        console.log("Pending is here");
                        /*if(!isTheSame(toBeUpdatedProduct, editedFields)){*/
                        const encodedId = jwt.sign(`${toBeUpdatedProduct._id}`, process.env.TOKEN_SECRET);
                        console.log(req.body.params.jvPageLink);
                        editHome.updateOne({$or: [{originalId: req.body.params.originalId}, {_id: req.body.params.originalId}]}, {
                            productName: req.body.params.name,
                            productDescription: req.body.params.description,
                            productCategory: req.body.params.category,
                            productPrice: parseInt(req.body.params.price),
                            productCommission: parseInt(req.body.params.commission),
                            productVendorName: req.body.params.vendorName,
                            productLaunchDate: req.body.params.LaunchDate,
                            jvPageLink: req.body.params.jvPageLink,
                            productNetwork: req.body.params.Network,
                            noteToReviewer: req.body.params.noteToReviewer,
                            listingType: req.body.params.category,

                            listingStatus: req.body.params.listingStatus,
                            reviewStatus: req.body.params.reviewStatus,
                            dateCreated: moment(),
                            encodedAvatarUrl: encodedId,
                        }, function (err, productDocs) {
                            productIdHashed = `${toBeUpdatedProduct._id}`;

                            home.updateOne({_id: req.body.params.originalId}, {
                                reviewStatus: req.body.params.reviewStatus,
                                listingStatus: req.body.params.listingStatus
                            }, function (err, updatedDocs) {

                                /*console.log("go create Image")*/
                                res.send(productDocs);


                            });

                        })

                    } else {
                        /*const encodedId = jwt.sign(`${toBeUpdatedProduct._id}`, process.env.TOKEN_SECRET);*/

                        editHome.create({
                            ownerEmail: req.body.params.ownerEmail,
                            productName: req.body.params.name,
                            productDescription: req.body.params.description,
                            productCategory: req.body.params.category,
                            productPrice: parseInt(req.body.params.price),
                            productCommission: parseInt(req.body.params.commission),
                            productVendorName: req.body.params.vendorName,
                            jvPageLink: req.body.params.jvPageLink,
                            productLaunchDate: req.body.params.LaunchDate,
                            productNetwork: req.body.params.Network,
                            noteToReviewer: req.body.params.noteToReviewer,
                            listingType: req.body.params.category,
                            listingStatus: req.body.params.listingStatus,
                            reviewStatus: req.body.params.reviewStatus,
                            originalId: req.body.params.originalId,
                            dateCreated: moment(),

                        }, function (err, productDocs) {
                            const encodedId = jwt.sign(`${productDocs._id}`, process.env.TOKEN_SECRET);
                            /*console.log(productDocs._id + " This is The ID");*/
                            home.updateOne({_id: req.body.params.originalId}, {
                                reviewStatus: req.body.params.reviewStatus,
                                listingStatus: req.body.params.listingStatus,
                                editedVersion: true,
                            }, function (err, updatedDocs) {
                                /*console.log("Created");*/


                            });

                            editHome.updateOne({_id: productDocs._id}, {encodedAvatarUrl: encodedId}, function (err, found) {
                                if (err) {
                                    /*console.log("This is happening " + err)*/
                                }
                                productIdHashed = `${productDocs._id}`;

                                /*console.log("found");*/

                                res.send(productDocs);

                            });
                        })
                    }
                } else if (editedFields.reviewStatus === "Approved") {

                    if (toBeUpdatedProduct) {
                        home.updateOne({_id: toBeUpdatedProduct.originalId}, {
                            editedVersion: false,
                            reviewStatus: req.body.params.reviewStatus,
                            listingStatus: req.body.params.listingStatus
                        }, function (err, versionChangedDocument) {
                            /*console.log(toBeUpdatedProduct, +'way' + versionChangedDocument);*/
                            if (versionChangedDocument) {
                                editHome.deleteOne({_id: req.body.params.originalId}, function (err, deleletSucess) {
                                    if (err) {
                                        console.error(err)
                                    } else {
                                        /*console.log("Successfully Updated and other");*/
                                        res.send("User Updated")

                                    }
                                })
                            } else {
                                /*console.log("not updated yet")*/
                            }

                        });
                    } else {
                        /*console.log("change Database")*/
                        res.send("Unhandled Case")

                    }


                } else if (editedFields.reviewStatus === "NA") {

                    if (toBeUpdatedProduct) {

                        /*if (!isTheSame(toBeUpdatedProduct, editedFields)) {*/
                        home.updateOne({_id: toBeUpdatedProduct.originalId}, {
                            productName: req.body.params.name,
                            productDescription: req.body.params.description,
                            productCategory: req.body.params.category,
                            productPrice: parseInt(req.body.params.price),
                            productCommission: parseInt(req.body.params.commission),
                            productVendorName: req.body.params.vendorName,
                            jvPageLink: req.body.params.jvPageLink,
                            productLaunchDate: req.body.params.LaunchDate,
                            productNetwork: req.body.params.Network,
                            noteToReviewer: req.body.params.noteToReviewer,
                            listingType: req.body.params.category,

                            listingStatus: req.body.params.listingStatus,
                            reviewStatus: req.body.params.reviewStatus,
                            originalId: req.body.params.originalId,
                            editedVersion: false,

                        }, function (err, versionChangedDocument) {
                            /*console.log(toBeUpdatedProduct, +'way' + versionChangedDocument);*/
                            editHome.deleteOne({_id: req.body.params.originalId}, function (err, deleletSucess) {
                                if (err) {
                                    console.error(err)
                                } else {
                                    /*console.log("Successfully Updated");*/
                                    res.send("User Updated")
                                }
                            })
                        });

                    } else {
                        //Here I have Unhandle case, where a req.body.params.orignalId doesn't exist
                        /*const encodedId = jwt.sign(`${req.body.params._id}`, process.env.TOKEN_SECRET);*/
                        /*const encodedAvatar = ()=>{
                            if(req.body.params.encodedAvatarUrl){
                                return req.body.params.encodedAvatarUrl
                            }else{
                                home.findOne({})
                            }
                        };*/

                        home.findOneAndUpdate({_id: req.body.params.originalId}, {
                            productName: req.body.params.name,
                            productDescription: req.body.params.description,
                            productCategory: req.body.params.category,
                            productPrice: parseInt(req.body.params.price),
                            productCommission: parseInt(req.body.params.commission),
                            productVendorName: req.body.params.vendorName,
                            jvPageLink: req.body.params.jvPageLink,
                            productLaunchDate: req.body.params.LaunchDate,
                            productNetwork: req.body.params.Network,
                            noteToReviewer: req.body.params.noteToReviewer,
                            listingType: req.body.params.category,

                            listingStatus: req.body.params.listingStatus,
                            reviewStatus: req.body.params.reviewStatus,
                            originalId: req.body.params.originalId,
                            dateCreated: moment(),
                        }, function (err, updatedDocument) {
                            if (err) {
                                console.error(err)
                            } else {
                                /*console.log("Update on the Product DB");*/
                                productIdHashed = `${req.body.params.originalId}`;

                                res.send("User Updated")

                            }
                        })
                    }


                } else if (editedFields.reviewStatus === "Rejected") {
                    /*console.log("You found the error!.");*/
                    res.send("User Can't Change Item Status To Rejected")

                } else {
                    /*console.log("Please Handle this Case");*/
                    home.updateOne({_id: req.body.params.originalId}, {
                        /*editedVersion: false,*/
                        reviewStatus: req.body.params.reviewStatus,
                        listingStatus: req.body.params.listingStatus
                    }, function (err, versionChangedDocument) {
                        /*console.log(versionChangedDocument);*/
                        res.send("User Updated")

                    });
                }


            };
            checkIfchanged();

        }
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





