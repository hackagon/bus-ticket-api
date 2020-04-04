const { jwtVerify } = require("../helpers/callback.helper");
const config = require("../config");

module.exports.authenticate = (req, res, next) => {
  // token (header/query string)
  const token = req.header("token");
  if (!token) return res.status(401).json({
    message: "You must provide token"
  })

  jwtVerify(token, config.secretKey)
    .then(decoded => {
      if (decoded) {
        req.user = decoded
        return next()
      }

      return res.status(200).json({
        message: "Token is invalid"
      })
    })
    .catch(err => res.status(500).json(err))
}

// phan biet: client & admin
// authorize(["admin"]) ==> chi cho admin
// authorize(["client"]) ==> chi cho client
// authorize(["admin", "client"]) ==> chi cho client
module.exports.authorize = (userTypeArray) => (req, res, next) => {
  const { userType } = req.user;
  const index = userTypeArray.findIndex(e => e === userType)
  if (index > -1) return next();

  res.status(403).json({ message: "You are not allowed to access" })
}