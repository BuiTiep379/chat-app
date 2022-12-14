const cloudinary = require('../utils/cloudinary');
const { Create, BadRequest, ServerError } = require('../utils/response');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const register = async (req, res) => {
  const data = req.body;
  const { email, password, username } = data;

  User.findOne({ email }).exec(async (error, user) => {
    if (error) return ServerError(res, error.message);
    if (user) return BadRequest(res, 'Địa chỉ email đã được đăng ký');
    let urlImage = '';
    if (data.image) {
      const uploadResponse = await cloudinary.uploader.upload(data.image, {
        folder: 'Images/UserMessage',
        resource_type: 'auto',
      });
      urlImage = uploadResponse.url;
    }
    let newUser;
    // console.log('new user ', req.body);
    newUser = new User({
      email,
      username,
      password,
    });
    if (urlImage) {
      newUser.image = urlImage;
    }
    newUser.save(async (error, user) => {
      if (error) return ServerError(res, error.message);
      if (user) {
        Create(res, 'Tạo tài khoản thành công!');
      }
    });
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).exec();
  if (!user) {
    return BadRequest(res, 'Email chưa được đăng ký tài khoản');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return BadRequest(res, 'Vui lòng xem lại mật khẩu');
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      image: user.image,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXP }
  );
  const options = {
    httpOnly: true,
  };
  return res.status(200).cookie('token', token, options).json({
    token,
  });
};
module.exports = {
  register,
  login,
};
