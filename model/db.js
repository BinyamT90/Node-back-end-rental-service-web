mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/agenagn';
/*var dbUrl = "mongodb+srv://kalab:kalab.1@cluster0.nifwn.mongodb.net/kiray?retryWrites=true&w=majority";*/

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


var user = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    confirmPassword: String,
    resetPasswordToken:String,
    resetPasswordExpires:Date,
});
var home = mongoose.Schema({
    location: String,
    bed_room : Number,
    monthly_payment: Number,
    floor: Number,
    squareMeter: String,
    phone_number: Number,
    guest_house : Boolean,
    description : String,
    owner_name: String,
    encodedImageUrl: String,
    ownerEmail: String,
    availabilityDate:Date,
    editedVersion: {type:Boolean, default:false},

    listingStatus: String,
    reviewStatus : String,

    dateCreated: Date,
    dateEdited: Date,
    encodedAvatarUrl: String
});
var editHome = mongoose.Schema({
    originalId : String,

    location: String,
    bed_room : Number,
    monthly_payment: Number,
    floor: Number,
    squareMeter:String,
    phone_number: Number,
    guest_house : Boolean,
    description : String,
    owner_name: String,
    encodedImageUrl: String,
    ownerEmail: String,
    availabilityDate:Date,

    listingType: String,
    listingStatus: String,
    reviewStatus : String,

    dateCreated: Date,
    dateEdited: Date,
    encodedAvatarUrl: String,

});


mongoose.model('home', home);
mongoose.model('editHome', editHome);
mongoose.model('user', user);



