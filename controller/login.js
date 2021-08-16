mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

var user = mongoose.model('user');

loginUser = function (req, res) {
    console.log(req.body);
    user.find({
        email: req.body.params.email,
    }, function (err, docs) {
        if (err) {
            console.log("Database connection error");
        } else {
            console.log(docs);
            if (docs.length > 0) {

                bcrypt.compare(req.body.params.password, docs[0].password, function (err, result) {
                    // result == true
                    if (result === true) {
                        dotenv.config();

                        function generateAccessToken(email) {
                            return jwt.sign(email, process.env.TOKEN_SECRET)
                        }

                        const generatedToken = generateAccessToken(req.body.params.email);

                        const fullDate = new Date();
                        const today = {
                            day: fullDate.getDate(),
                            month: fullDate.getMonth(),
                            year: fullDate.getFullYear()
                        };



                        console.log(generatedToken);
                        res.send({token: generatedToken})
                    } else {
                        res.send("notUser")
                    }
                });

            } else {
                res.send("notUser")

            }
        }

    });
};

module.exports = loginUser;