const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/socialWebsite');

const likeSchema = new mongoose.Schema({

    userId: {
        type: String,
    },
   postId:{
    type:String
   }
   
    
});

const like = mongoose.model('like',likeSchema);
module.exports = like;