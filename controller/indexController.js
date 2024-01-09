const user = require('../model/user');
const sendVerificationEmail = require('./sendVerificationEmail');
const crypto = require('crypto');
const secretKey = process.env.JWT_SECRET || 'default_secret_key';
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const cloudinaryMulter = require('cloudinary-multer');
cloudinary.config({ 
  cloud_name: 'doohfuqj3', 
  api_key: '652251984127554', 
  api_secret: 'G5usqBPKCu0-NRVFPyIb50oDueo' 
});



// ============================== Login and Register ======================================
const store_register = async (req, res) => {
  const { first_name, userName, password, gender, email, termCondecation } = req.body;
  console.log(first_name, email, password);

  const generateUniqueToken = (length = 20) => {
    return crypto.randomBytes(length).toString('hex');
  };
  const verificationToken = generateUniqueToken();
  const newUser = await new user({ first_name, userName, email, password, gender, termCondecation, verificationToken });
   const userData = await newUser.save();
  sendVerificationEmail(first_name,email, verificationToken,userData._id);
  req.flash('success', 'Please Verify You Email');
  res.redirect('/');
};

const verify = async (req , res)  => {
try {
  const update = await user.updateOne({_id:req.query.id},{$set:{is_verified:1}});
  console.log(update);
  res.render("emailVerified");
} catch (error) {
  console.log(error.message);
} 
}

const store_login = async (req, res) => {
  const { userName, password } = req.body;
  const data = await user.findOne({ userName, password, is_verified: 1 });

  if (!data) {
    req.flash('error', 'Invalid username or password');
    return res.redirect('/');
  }else{
  const token = jwt.sign({ id: data._id, userName: data.userName }, secretKey, {
      expiresIn: '30d',
  });
  req.session.token = token;
  console.log(data._id);
  res.redirect('/index');
}
};

const logout = async(req, res, next) => {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
};

// ============================== End  Login and Register ======================================






// ============================== Cover Photo ana Profile Photo Upload ========================
const storage = cloudinaryMulter({
  cloudinary: cloudinary,
  allowedFormats: ['jpg', 'jpeg', 'png'],
  transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional: Add image transformations
});
const upload = multer({ storage: storage });

const upload_profile = upload.single('photo');
const store_profile_photo = async(req , res) => {
  const User =req.user;
  const UserId = User.id;
  const profile_photo = req.file.url
  await user.findByIdAndUpdate(UserId, { profile_photo });
  res.redirect('/profile');
}

// ============================== End Cover Photo ana Profile Photo Upload =========================


module.exports  = {
  store_register,
  verify,
  store_login,
  store_profile_photo,
  upload_profile,
  logout
}







