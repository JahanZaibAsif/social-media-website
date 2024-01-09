const data = require('../model/post');
const liked = require('../model/liked');
const friendRequest = require('../model/friendRequest');
const express = require('express');
const session = require('express-session');
const { findOne, deleteOne } = require('../model/user');
const fs = require('fs');
var multer = require('multer');
const secretKey = process.env.JWT_SECRET || 'default_secret_key';
const app = express();
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false
}));



// ===================================== Text Post =========================================

const storage = multer.diskStorage({
  destination : function (req ,file ,cb){
       cb(null, "./upload/image_post");
  },
  filename : function (req ,file ,cb) { 
       cb(null, `${Date.now()}-${file.originalname}`);
  }
});
var upload = multer({ storage: storage });

const image_post = upload.single('image_post');
const text_post = async(req,res) => {
  const userId = req.user.id;
    const{text_post} = req.body;
    if(req.file){
      const image_post = req.file.filename;
      const textPost = await new data({text_post,image_post,userId});
      await textPost.save();
       res.redirect('/index');
    }else{
    const textPost = await new data({text_post,userId});
    await textPost.save();
     res.redirect('/index');
    }
} 

const post_delete = async (req, res) => {
  const Login_user = req.user.id;

  try {
    const post = await data.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    const userId = post.userId;
    const image_name = post.image_post;
    const imagePath = `upload/image_post/${image_name}`;

    if (Login_user === userId) {
      fs.unlink(imagePath, (err) => {
        data.findByIdAndDelete(req.params.id)
          .then(() => {
            res.redirect('/index');
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Internal Server Error');
          });
      });
    } else {
      res.redirect('/index');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Modify your existing controller or add this to your controllers file
const create_like = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const like_post = await liked.findOne({ postId, userId });

    if (like_post) {
      await liked.deleteOne({ _id: like_post._id });
    } else {
      const newLike = new liked({ postId, userId });
      await newLike.save();
    }

    // Fetch updated like count
    const updatedLikeCount = await liked.countDocuments({ postId });

    res.json({ success: true, likeCount: updatedLikeCount });
  } catch (error) {
    console.error('Error in create_like_ajax:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};




// friend request


const friend_request = async(req , res) => {
  senderId = req.user.id;
  receiverId = req.params.id;
  const FriendRequest = new friendRequest({senderId,receiverId});
  await FriendRequest.save();
  res.redirect('/index');
}

const accept_request = async(req , res) => {
  const status = 1;
   await friendRequest.findByIdAndUpdate(req.params.id,{$set:{status:status}});
   res.redirect('/index');
}




// ===================================== End Text Post =====================================

module.exports= {
    text_post,
    image_post,
    post_delete,
    create_like,
    friend_request,
    accept_request,
}