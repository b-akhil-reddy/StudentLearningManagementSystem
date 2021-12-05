const {Router} = require("express")
const {allMessages,addNotice,deleteNotice} = require("../controllers/noticeBoardController")
const {notices} = require("../controllers/contentControllers")
const {verifyAccessToken} = require("../controllers/authControllers")
const {upload} = require("../controllers/filesControllers")
const router = Router()

router.get("/noticeBoard",verifyAccessToken,allMessages,notices)
router.post("/noticeBoard",verifyAccessToken,allMessages,notices)
router.post("/addMessage",verifyAccessToken,upload.array('file'),addNotice)
router.get("/deleteNotice/:notice",verifyAccessToken,deleteNotice)
router.post("/deleteNotice/:notice",verifyAccessToken,deleteNotice)

module.exports = router