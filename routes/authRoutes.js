const {Router} = require('express')

const authRoute = Router()

const {signinUser,signoutUser,verifyAccessToken,signupUser,resetPassword,changePassword} = require("../controllers/authControllers")
const {signupValidations, changePasswordValidations} = require("../validations/userValidations")

authRoute.post("/register",verifyAccessToken,signupValidations,signupUser)
authRoute.post("/login",signinUser)
authRoute.post("/resetPassword",resetPassword)
authRoute.post("/changePassword",changePasswordValidations,changePassword)
authRoute.get("/logout",verifyAccessToken,signoutUser)

module.exports = authRoute