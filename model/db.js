mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/agenagn';
/*
if (process.env.NODE_ENV === 'production') {
    dbUrl = "mongodb+srv://kalab:kalab.1@cluster0.nifwn.mongodb.net/kiray?retryWrites=true&w=majority";


}*/
mongoose.connect(dbUrl);

// CONNECTION EVENTS
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbUrl);
});
mongoose.connection.on('errorho', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

var houseDetail = mongoose.Schema({
    place: String,
    numberOfBedRoom: Number,
    Flour: Number,
    monthlyrent: Number,
    userphonenumber: Number,
    GuestHouse: {Boolean:false},
    approval: Boolean,

});

var user = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    confirmPassword: String
});
var home = mongoose.Schema({
    location: String,
    bed_room : Number,
    monthly_payment: Number,
    floor: Number,
    phone_number: Number,
    guest_house : Boolean,
    description : String,
    owner_name: String,
    encodedImageUrl: String,
    ownerEmail: String,

});


mongoose.model('houseDetail', houseDetail);
mongoose.model('home', home);
mongoose.model('user', user);



