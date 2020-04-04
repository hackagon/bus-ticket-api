const express = require("express");
const userController = require("./controller");
const { authenticate, authorize } = require("../../../middlewares/auth")
const { uploadImage } = require("../../../middlewares/uploadImage")
const { validateCreateUser } = require("../../../middlewares/validation/user")
const router = express.Router();

// router.get("/", userController.getUsers)
// router.get("/:id", userController.getUserById)
router.post(
  "/",
  validateCreateUser,
  userController.createUser
)
router.post("/login", userController.login)
// router.put("/:id", userController.replaceUserById)
// router.patch("/:id", userController.updateUserById)
// router.delete("/:id", userController.deleteUserById)
router.post(
  "/avatar",
  authenticate,
  authorize(["client"]),
  uploadImage("avatar"),
  userController.uploadAvatar
)

module.exports = router;