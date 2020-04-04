const validator = require('validator');
// co the dung Joi
const _ = require('lodash');
const { User } = require("../../models/User");

// inputs: email, password, password2, fullName
// email (frontend ko tra ve | undefined) ==> email = ""
module.exports.validateCreateUser = async (req, res, next) => {
  let errors = {};

  // validate ....
  const email = _.get(req, "body.email", "");
  const password = _.get(req, "body.password", "");
  const password2 = _.get(req, "body.password2", "");
  const fullName = _.get(req, "body.fullName", "");

  // email
  // email === "" ==> errors.email = "Email is required"
  // email da ton tai ==> errors.email = "Email exist"
  // email co dung dinh dang hay ko (abc@gmail.com) ==> "Eamil is invalid"
  // email hop le ==> pass qua
  if (validator.isEmpty(email)) {
    errors.email = "Email is required"
  } else {
    const user = await User.findOne({ email })
    if (user) {
      errors.email = "Email exists"
    } else if (!validator.isEmail(email)) {
      errors.email = "Email is invalid"
    }
  }

  // password
  if (validator.isEmpty(password)) {
    errors.password = "Password is required"
  } else if (!validator.isLength(password, { min: 8 })) {
    errors.password = "Password must have at least 8 characters"
  }

  if (validator.isEmpty(password2)) {
    errors.password2 = "Confirmed password is required"
  } else if (!validator.equals(password, password2)) {
    errors.password2 = "Password must match"
  }

  if (validator.isEmpty(fullName)) {
    errors.fullName = "Fullname is required"
  }

  const isValid = _.isEmpty(errors)
  if (isValid) return next();
  res.status(400).json(errors)
}


module.exports.validateLoginInput = () => {

}

module.exports.updateUserInput = () => {

}

module.exports.uploadAvatar = () => {

}