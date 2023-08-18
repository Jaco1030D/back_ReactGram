const express = require("express")
const { register, login, getCurrentUser, update, getUserById } = require("../controllers/UserController")
const authGuard = require("../middlewares/authGuard")
const router = express.Router()

const validate = require("../middlewares/handleValidator")
const { imageUpload } = require("../middlewares/imageUploads")
const {userCreateValidation, loginValidation, userUpdateValidation} = require("../middlewares/userValidation")

router.post("/register", userCreateValidation(),validate, register)
router.post("/login", loginValidation(),validate, login)
router.get("/profile", authGuard, getCurrentUser)
router.put("/", authGuard, userUpdateValidation(), validate, update)
router.get("/:id", getUserById)

module.exports = router
