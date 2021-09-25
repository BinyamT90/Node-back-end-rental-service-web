mongoose = require('mongoose');

var product = mongoose.model('product');

const Filter = function (req, res) {
    console.log(req.query.selectedRadio);



    if (req.query.selectedRadio === "All") {
        product.find({listingStatus: "Active"}, function (err, docs) {
            if (err) {
                console.error(err)
            } else {
                res.send(docs);
            }
        });

    }else if (req.query.selectedRadio === "Premium") {
        product.find({listingStatus: "Active", isPremiumLaunch:true}, function (err, docs) {
            if (err) {
                console.error(err);
            } else {
                res.send(docs);
            }
        });

    }
    else {
        product.find({productCategory: req.query.selectedRadio, listingStatus: "Active"}, function (err, docs) {
            if (err) {
                console.error(err)
            } else {
                res.send(docs)
            }
        });
    }

};

module.exports = Filter;