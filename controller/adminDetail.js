const home = mongoose.model('home');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

process.env.TOKEN_SECRET = "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ"
const images = require('./readImages')

function detail(req, res) {
    dotenv.config();
    var userToken = req.headers['x-access-token'];
    if (!userToken) return res.send("no token provided");

    let decodedEmail = jwt.verify(userToken, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.send('Failed to authenticate')
        } else {
            return decoded

        }
    });

    if (decodedEmail === 'justt@gmail.com') {
        home.findById(req.query.id, function (err, docs) {
            if (err) {
                console.log(err);

            } else {
                const getImage = async () => {
                    const files = await images.readImages(docs.ownerEmail, docs._id);
                    let fileDocs = {docs, files};
                    console.log(files);
                    res.send(fileDocs)
                };
                getImage();

            }
        })
    } else {
        res.send('No Admin')
    }

}

module.exports = detail;