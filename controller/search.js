var home = mongoose.model('home');
var path = require('path');

function search(req, res) {
    const keyword = new RegExp(req.query.q, 'i');
    const payment = function (pay) {
        switch (parseInt(pay)) {
            case 0:
                return {monthly_payment: {$gt: 2000, $lt: 4001}};
            case 1:
                return {monthly_payment: {$gt: 4002, $lt: 6001}};
            case 2:
                return {monthly_payment: {$gt: 6001, $lt: 8001}};
            case 3:
                return {monthly_payment: {$gt: 8001, $lt: 12001}};
            case 4:
                return {monthly_payment: {$gt: 12001, $lt: 20001}};
            case 5:
                return {monthly_payment: {$gt: 20001}};
            default:
                return {monthly_payment: {$gt: 2001, $lt: 1000001}}

        }
    };

    const bedroom = function (room) {
        switch (parseInt(room)) {
            case 0:
                return {bed_room: 0};
            case 1:
                return {bed_room: 1};
            case 2:
                return {bed_room: 2};
            case 3:
                return {bed_room: 3};
            case 4:
                return {bed_room: 4};
            default:
                return {bed_room: {$gt: 0}}

        }

    };
    const location = function (loca) {
        const locaKey = new RegExp(loca, 'i');
        return {location: {$regex: locaKey}};

    };
    /*{$or: req.query.bedroom !== undefined ? req.query.bedroom.map((room) => bedroom(room)) : [{bed_room: {$lt: 6}}]},*/
    console.log(req.query.guestHouse, 'guest');
    home.find({
        listingStatus: "Active",
        location: {$regex: keyword},
        $and: [
            {$or: req.query.payment !== undefined ? req.query.payment !== null ? req.query.payment.map((que) => payment(que)) : [{monthly_payment: {$gt: 10}}] : [{monthly_payment: {$gt: 10}}]},
            {$or: req.query.bedroom !== undefined ? req.query.bedroom !== null ? req.query.bedroom.map((room) => bedroom(room)) : [{bed_room: {$lt: 6}}] : [{bed_room: {$lt: 10}}]},
            {$or: req.query.location !== undefined ? req.query.location !== null ? req.query.location.map((loca) => location(loca)) : [{bed_room: {$lt: 6}}] : [{bed_room: {$lt: 10}}]},
            {$or: req.query.guestHouse !== undefined ? req.query.guestHouse === true? [{guest_house:true}]:[{guest_house:false}]:[{guest_house: false}]},
        ]

    }, function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            console.log(docs, 'search docs');
            const finalDocs = [];
            docs.forEach(function (doc) {
                const directoryPath = path.join(__dirname, '../public/images/products/' + doc.ownerEmail + '/' + doc._id);
                if (fs.existsSync(directoryPath)) {
                    fs.readdir(directoryPath, function (err, files) {
                        if (err) {
                            return console.log('Unable to scan directory: ' + err);
                        }
                        doc['Img'] = files[0];
                        let thedocs = {...doc};
                        finalDocs.push(thedocs)
                    });
                }
            });
            setTimeout(function () {
                res.send(finalDocs)
            }, 1000)


        }
    })


}

module.exports = search;