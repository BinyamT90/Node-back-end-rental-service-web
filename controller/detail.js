var path = require('path');

const home = mongoose.model('home');

function detail(req, res) {
    console.log(req.query.id);
    home.findById(req.query.id, function (err, docs) {
        if (err){
            console.log(err);
        }else{
            console.log('ata');
            const directoryPath = path.join(__dirname, '../public/images/products/' + docs.ownerEmail + '/' + docs._id);
            if (fs.existsSync(directoryPath)) {
                fs.readdir(directoryPath, function (err, files) {
                    if (err) {
                        return console.log('Unable to scan directory: ' + err);
                    }
                    console.log(files + " files .length");
                    var fileDocs = {docs, files};
                    res.send(fileDocs)

                });
            }

        }
    })

}

module.exports = detail;