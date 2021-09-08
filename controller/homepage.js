mongoose = require('mongoose');

var home = mongoose.model('home');

function homepage(req, res) {


    home.find({ listingStatus: "Active"}, function (err, docs) {
        if (err) {
            console.error(err)
        } else {
            console.log(docs);
            const images = [];
            for (let i = 0; i < docs.length; i++) {
                const directoryPath = path.join(__dirname, '../public/images/products/' + docs[i].ownerEmail + '/' + docs[i]._id);
                if (fs.existsSync(directoryPath)) {
                    fs.readdir(directoryPath, function (err, files) {
                        if (err) {
                            return console.log('Unable to scan directory: ' + err);
                        }
                        console.log(files + " files .length");
                        images.push(files[0]);
                    });
                }
            }
            if(images.length===docs.length){
                var fileDocs = {docs, images};

                res.send(fileDocs)
            }

        }
    })


};

module.exports = homepage;