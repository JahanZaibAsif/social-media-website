const express = require('express');
const app = express();
const User = require('../model/user');
const data = require('../model/post');
const Comment = require('../model/comment');
const liked = require('../model/liked');
const friendRequest = require('../model/friendRequest');
const moment = require('moment');
const router = express.Router();
const indexController = require('../controller/indexController');
const postController = require('../controller/postController');
const {checkTokenExpiration} = require('../controller/middleware');
// router.use(checkTokenExpiration);
// ============================== Login and Register ==========================================
// router.use((req, res, next) => {
//     if (req.path !== '/store_login' && req.path !== '/store_register' && req.path !== '/' && req.path !== '/verify') {
//       checkTokenExpiration(req, res, next);
//     } else {
//       next();
//     }
//   });

router.get('/' ,(req, res) => {
    res.render("login",
    {
       errorMessage: req.flash('error'),
       emailVerify: req.flash('success')
     }
    );
  });
router.get('/index',checkTokenExpiration, async(req, res) => {
  const user = req.user;
 
    const Profile = await User.findOne({_id:user.id});

    const addFriend = await User.find();

    const login_user= req.user.id;

    const postData = await data.find().sort({ _id: -1 });
    const Data = await Promise.all(postData.map(async post => {
      const user = await User.findById(post.userId);
      const like = await liked.countDocuments({postId:post._id});
      const totalComment = await Comment.countDocuments({postId:post._id});
      return {
        name: user.first_name,
        text_post: post.text_post,
        image_post: post.image_post,
        createdAt:post.createdAt,
        _id :post._id,
        profile_picture_url: user ? user.profile_photo : null,
        like,
        totalComment
      };
    }));

    // friend request
    const FriendRequest = await friendRequest.find({receiverId:login_user,status:0});
    const  friend_request = await Promise.all(FriendRequest.map(async value =>{
      const userCollection = await User.findById(value.senderId);
      return{
        _id:value._id,
        profile_photo:userCollection.profile_photo,
        name:userCollection.first_name,
      }
    })); 
    // end friend request


    // show the comment 
    const allComment = await Comment.find();
    const comment_post = await Promise.all(allComment.map(async value =>{
      const postCollection = await data.findById({_id:value.postId});
      const userCollection = await User.findById(value.userId);
      return{
        createdAt:value.createdAt,
        comment:value.comment,
        username:userCollection.first_name,
        user_photo:userCollection.profile_photo,
        id:value._id,
        postId:value.postId
      }
    }));
    // end show the comment


    res.render("index", 
    {
      comment_post,
      friend_request,
      addFriend,
      moment,
      Profile,
      Data,
    });
});

router.get('/profile',checkTokenExpiration, async(req, res) => {
    const user = req.user;
    const Profile = await User.findOne({_id:user.id});
    
    res.render('profile',{Profile});
});


router.post('/store_register' , indexController.store_register);
router.get('/verify' , indexController.verify);
router.post('/store_login', indexController.store_login);
router.get('/logout', indexController.logout);


// ============================== End  Login and Register ======================================



// ==============================  Cover Photo ana Profile Photo Upload =========================
router.post('/store_profile_photo', checkTokenExpiration, indexController.upload_profile, indexController.store_profile_photo);

// ============================== End Cover Photo ana Profile Photo Upload =========================




// =============================== Text , Video , picture Post ======================================
  
    router.post('/text_post' ,checkTokenExpiration, postController.image_post, postController.text_post);

    router.get('/post_delete/:id' ,checkTokenExpiration, postController.post_delete);

    router.post('/like_post/:id' ,checkTokenExpiration, postController.create_like);

    router.get('/friend_request/:id' ,checkTokenExpiration, postController.friend_request);

    router.post('/accept_request/:id' , postController.accept_request);

    router.post('/:id/comment' ,  checkTokenExpiration, postController.comment);

// =============================== End Text , Video , picture Post ======================================





module.exports = router;


















