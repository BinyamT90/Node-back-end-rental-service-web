var path = require('path');

function readImages(ownerEmail, Id) {
    console.log(ownerEmail, Id);
    const directoryPath = path.join(__dirname, '../public/images/products/' + ownerEmail + '/' + Id);

    return new Promise(function (resolve, reject) {
        if (fs.existsSync(directoryPath)) {
            fs.readdir(directoryPath, function (err, files) {
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                }
                resolve ( files);
            });
        }else{
            resolve('how')
        }
    })

}

module.exports = {readImages}