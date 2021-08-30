const jwt = require('jsonwebtoken');
const moment = require('moment');
const dotenv = require('dotenv');

var home = mongoose.model('home');
var user = mongoose.model('user');
var editHome = mongoose.model('editHome');


function dashboard(req, res) {
    dotenv.config();
    var userToken = req.headers['x-access-token'];
    if (!userToken) return res.send("no token provided");

    let decodedEmail = jwt.verify(userToken, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) return res.send('Failed to authenticate');
        return decoded
    });
    //check if the email is admin's email.
    console.log(decodedEmail);
    const filterBasedOn = (condition) => {
        home.find({editedVersion: true, reviewStatus: condition}, function (err, homeDocs) {
            if (err) {
                console.error(err)
            } else {
                editHome.find({reviewStatus: condition}, function (err, editedDocumentDocs) {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log(editedDocumentDocs + "or" + homeDocs);
                        for (let i = 0; i < editedDocumentDocs.length; i++) {
                            homeDocs.push(editedDocumentDocs[i])
                        }
                        const userAndProduct = {
                            docs: {email: 'justt@gmail.com', name: 'justt'},
                            homeDocs: homeDocs,
                            auth: "Admin"
                        };
                        res.send(userAndProduct);
                    }
                });

            }
        });
    };
    if (decodedEmail === 'justt@gmail.com') {
        console.log(req.query);
        switch (req.query.filter) {
            case"Sort by date":
                home.find({listingStatus: {$ne: 'Draft'}, editedVersion: false}, function (err, homeDocs) {
                    if (err) {
                        console.error(err)
                    } else {
                        editHome.find({listingStatus: {$ne: 'Draft'}}, function (err, editedDocumentDocs) {
                            if (err) {
                                console.error(err)
                            } else {
                                for (let i = 0; i < editedDocumentDocs.length; i++) {
                                    homeDocs.push(editedDocumentDocs[i])
                                }
                                /*console.log(moment(homeDocs[1].dateCreated).format('x') + "ena" + moment(homeDocs[0].dateCreated).format('x'));*/
                                /*console.log(homeDocs[1].homeName + " ena " + homeDocs[0].homeName);*/
                                homeDocs.sort(function (a, b) {
                                    return moment(b.dateCreated).format('x') - moment(a.dateCreated).format('x');
                                });

                                const userAndProduct = {
                                    docs: {email: 'justt@gmail.com', name: 'justt'},
                                    homeDocs: homeDocs,
                                    auth: "Admin"
                                };
                                res.send(userAndProduct);
                            }
                        });

                    }
                });
                break;
            case"Sort by name":
                home.find({listingStatus: {$ne: 'Draft'}, editedVersion: false}, function (err, homeDocs) {
                    if (err) {
                        console.error(err)
                    } else {
                        editHome.find({}, function (err, editedDocumentDocs) {
                            if (err) {
                                console.error(err)
                            } else {
                                for (let i = 0; i < editedDocumentDocs.length; i++) {
                                    homeDocs.push(editedDocumentDocs[i])
                                }
                                homeDocs.sort(function (a, b) {
                                    var nameA = a.homeName.toUpperCase(); // ignore upper and lowercase
                                    var nameB = b.homeName.toUpperCase(); // ignore upper and lowercase
                                    if (nameA < nameB) {
                                        return -1;
                                    }
                                    if (nameA > nameB) {
                                        return 1;
                                    }

                                    // names must be equal
                                    return 0;
                                });
                                /*let sortedByBrand = homeDocs.sort((first, second) => first.homeName > second.homeName);*/
                                console.log(homeDocs);
                                const userAndProduct = {
                                    docs: {email: 'justt@gmail.com', name: 'justt'},
                                    homeDocs: homeDocs,
                                    auth: "Admin"
                                };
                                res.send(userAndProduct);
                            }
                        });

                    }
                });

                /*home.find().collation({locale: "en"}).sort({homeName: 'asc', _id: 1}).exec(function (err, docs) {
                    res.send(docs);
                });*/
                /* home.find({},null, {collation:{locale:"en"},sort:{homeName:'desc'}},function (err, docs) {
                     console.log(docs);
                     res.send(docs);
                 });*/
                break;
            case"Approved":
                filterBasedOn("Approved");

                break;
            case"Pending":
                filterBasedOn("Pending");
                break;
            case "All Status":
                home.find({listingStatus: {$ne: 'Draft'}, editedVersion: false}, function (err, homeDocs) {
                    if (err) {
                        console.error(err)
                    } else {
                        editHome.find({listingStatus: {$ne: 'Draft'}}, function (err, editedDocumentDocs) {
                            if (err) {
                                console.error(err)
                            } else {
                                for (let i = 0; i < editedDocumentDocs.length; i++) {
                                    homeDocs.push(editedDocumentDocs[i])
                                }

                                const userAndProduct = {
                                    docs: {email: 'justt@gmail.com', name: 'justt'},
                                    homeDocs: homeDocs,
                                    auth: "Admin"
                                };
                                res.send(userAndProduct);
                            }
                        });

                    }
                });
                break;
            case"Rejected":
                filterBasedOn("Rejected");
                break;
            default:
                filterBasedOn("Pending");
                /*home.find({listingStatus: {$ne: 'Draft'}, editedVersion: false}, function (err, homeDocs) {
                    if (err) {
                        console.error(err)
                    } else {
                        editHome.find({listingStatus: {$ne: 'Draft'}}, function (err, editedDocumentDocs) {
                            if (err) {
                                console.error(err)
                            } else {
                                for (let i = 0; i < editedDocumentDocs.length; i++) {
                                    homeDocs.push(editedDocumentDocs[i])
                                }

                                const userAndProduct = {
                                    docs: {email: 'justt@gmail.com', name: 'justt'},
                                    homeDocs: homeDocs,
                                    auth: "Admin"
                                };
                                res.send(userAndProduct);
                            }
                        });

                    }
                });*/


                break;
        }

    } else {
        user.findOne({email: decodedEmail}, function (err, docs) {
            if (err) {
                console.error(err)
            } else {
                home.find({ownerEmail: decodedEmail}, function (err, homeDocs) {
                    if (err) {
                        console.error(err)
                    } else {
                        editHome.find({ownerEmail: decodedEmail}, function (err, editedDocumentDocs) {
                            if (err) {
                                console.error(err)
                            } else {
                                for (let i = 0; i < editedDocumentDocs.length; i++) {
                                    homeDocs.push(editedDocumentDocs[i])
                                }
                                const userAndProduct = {docs: docs, homeDocs: homeDocs, auth: "User"};
                                res.send(userAndProduct);
                            }
                        });

                    }
                })

            }
        });

    }

}

module.exports = dashboard;