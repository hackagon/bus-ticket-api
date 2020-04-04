const bcrypt = require('bcryptjs');
const _ = require("lodash");
const { User } = require("../../../models/User");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const config = require("../../../config");

const jwtSign = promisify(jwt.sign);

module.exports.createUser = (req, res, next) => {
  const { email, password, fullName } = req.body;
  const newUser = new User({
    email, password, fullName
  })
  newUser.save()
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err))
}

// ko update password
// update email, fullName
module.exports.updateUser = () => {

}

// nhap old password ==> compare with hash
// nhap new passaword 
module.exports.updatePassword = () => {

}

// reset password
// gui password moi (ngau nhien) cho nguoi dung
module.exports.resetPassword = () => {

}

// login (passport)
module.exports.login = (req, res, next) => {
  // 1. so sanh
  // 2. cap token
  const { email, password } = req.body;
  // find, findOne, findById
  let user;
  User.findOne({ email })
    .then(_user => {
      user = _user;
      if (!user) return Promise.reject({ message: "Email not exist" })

      return bcrypt.compare(password, user.password)
    })
    .then(isMatched => {
      if (!isMatched) return Promise.reject({ message: "Wrong password" })

      const payload = _.pick(user, ["_id", "email", "fullName", "userType"])
      return jwtSign(
        payload,
        config.secretKey,
        { expiresIn: '1h' }
      )
    })
    .then(token => res.status(200).json({
      message: "success",
      token
    }))
    .catch(err => res.status(500).json(err))
}

// upload avatar
module.exports.uploadAvatar = (req, res, next) => {
  const { _id } = req.user
  User.findById(_id)
    .then(user => {
      if (!user) return Promise.reject({ message: "User not found" })

      user.avatar = req.file.path;
      return user.save()
    })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err))
}