const {Router} = require("express")
const {publicFile} = require("../controllers/commonControllers")
const {verifyAccessToken} = require("../controllers/authControllers")
const router = Router()

router.get("/files/:file",verifyAccessToken,publicFile)

module.exports = router