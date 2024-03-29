const {Router} = require("express")
const {index,login,register,profile,resetPassword,changePassword,about} = require("../controllers/contentControllers")
const {verifyAccessToken,signoutUser} = require("../controllers/authControllers")
const { listCourses, listStudentCourses, listTutorCourses } = require("../controllers/courseControllers")
const router = Router()

router.get("/",verifyAccessToken,listCourses,listStudentCourses,listTutorCourses,index)
router.post("/",verifyAccessToken,listCourses,listStudentCourses,listTutorCourses,index)
router.get("/index",verifyAccessToken,index)
router.post("/index",verifyAccessToken,index)
router.get("/home",verifyAccessToken,index)
router.post("/home",verifyAccessToken,index)
router.get("/login",verifyAccessToken,login)
router.post("/login",verifyAccessToken,login)
router.get("/resetPassword",verifyAccessToken,resetPassword)
router.post("/resetPassword",verifyAccessToken,resetPassword)
router.get("/changePassword",verifyAccessToken,changePassword)
router.post("/changePassword",verifyAccessToken,changePassword)
router.get("/register",verifyAccessToken,register)
router.post("/register",verifyAccessToken,login)
router.get("/logout",verifyAccessToken,signoutUser)
router.get("/about",verifyAccessToken,about)
router.get("/profile",verifyAccessToken,profile)

module.exports = router