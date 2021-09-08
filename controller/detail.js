const home = mongoose.model('home');

const images =require( './readImages')
function detail(req, res) {
    console.log(req.query.id);
    home.findById(req.query.id, function (err, docs) {
        if (err){
            console.log(err);

        }else{
            const getImage = async ()=>{
                const files = await images.readImages(docs.ownerEmail, docs._id);
                let fileDocs = {docs, files};
                console.log(files);
                res.send(fileDocs)
            };
            getImage();

        }
    })

}

module.exports = detail;