const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/socialWebsite');

const CommentSchema = new mongoose.Schema({

    userId: {
        type: String
    },
    postId:{
    type:String
   },
   comment:{
    type:String
   },
   commentId:{
    type:String
   }
},
{
    timestamps:true
});

const Comment = mongoose.model('Comment',CommentSchema);
module.exports = Comment;