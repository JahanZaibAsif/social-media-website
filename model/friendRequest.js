const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/socialWebsite');

const FriendRequestSchema = new mongoose.Schema({

    senderId: {
        type: String,
    },
    receiverId:{
    type:String
   },
   status:{
    type:Number,
    default:0
   }
   
    
});

const friendRequest = mongoose.model('friendRequest',FriendRequestSchema);
module.exports = friendRequest;