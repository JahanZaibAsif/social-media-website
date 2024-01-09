const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/socialWebsite');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum length for the password
        maxlength: 12 // Maximum length for the password
    },
   gender: {
        type: String,
        enum: ['male', 'female'],
     
    },
    termCondition: {
        type: String,
        enum: ['true', 'false'], 
     
    },
    verificationToken:{
        type:String
    },
    is_verified:{
        type:Number,
        default:0
    },
    cover_photo:{
        type:String,
        default:''
    },
    profile_photo:{
        type:String,
        default:''
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
