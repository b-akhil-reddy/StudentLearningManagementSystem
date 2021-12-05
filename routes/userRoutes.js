const {Router} = require("express")
const {getUserDetails} = require("../controllers/userControllers")
const {user} = require("../controllers/contentControllers")
const {verifyAccessToken} = require("../controllers/authControllers")
const router = Router()

router.get("/:id",verifyAccessToken,getUserDetails,user)

module.exports = router