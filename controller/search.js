var home = mongoose.model('home');

function search(req, res) {
    console.log(req.query);
    const keyword = new RegExp(req.query.q, 'i');
    home.find({listingStatus: "Active",location:{$regex: keyword}}, function (err, docs) {
        if(err){
            console.log(err);
        }else{
            res.send(docs)
        }
    })




}

module.exports = search;