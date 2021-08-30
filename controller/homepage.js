mongoose = require('mongoose');

var home = mongoose.model('home');

function homepage(req, res) {


    home.find({ listingStatus: "Active"}, function (err, docs) {
        if (err) {
            console.error(err)
        } else {
            console.log(docs);
            res.send(docs)

        }
    })


};

module.exports = homepage;