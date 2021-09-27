mongoose = require('mongoose');
fs = require('fs');
mongoose = require('mongoose');
var feedback = mongoose.model('feedback');
module.exports.addNewFeedback = function (req, res) {
    feedback.create({
        email: req.body.email,
        feed: req.body.feedback
    }, function (err, feedbackDocs) {
        if (err) {
            console.log(err);
        } else {
            res.send(feedbackDocs);
        }
    })
};
