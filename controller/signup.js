mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
process.env.TOKEN_SECRET = "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ"
var user = mongoose.model('user');

signUpUser = function (req, res) {
    console.log(req.body);
    user.find({email: req.body.email}, function (err, docs) {
        if (err) {

        } else {
            if (docs[0] && req.body.email === docs[0].email) {
                res.send("userExist");
            } else {
                const myPlaintextPassword = req.body.password;

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
                        // Store hash in your password DB.
                        dotenv.config();
                        function generateAccessToken(email) {
                            return jwt.sign(email, process.env.TOKEN_SECRET)
                        }

                        const generatedToken = generateAccessToken(req.body.email);
                        const fullDate = new Date();
                        const today = {
                            day: fullDate.getDate(),
                            month: fullDate.getMonth(),
                            year: fullDate.getFullYear(),
                        };
                        user.create({
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                            joinedDate: today,
                            lastLogin: today,


                        }, function (err, docs) {
                            if (err) {
                                res.send(err)
                            } else {
                                res.send(generatedToken)

                            }
                        });
                    })
                });

            }
        }
    });


};


module.exports = signUpUser;
