const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/socialWebsite');

const dataSchema = new mongoose.Schema({
    text_post: {
        type: String,
    },
    image_post: {
        type: String,
    },
   userId:{
    type:String
   }}, {
    timestamps: true
    
});

const Data = mongoose.model('data', dataSchema);

module.exports = Data;

