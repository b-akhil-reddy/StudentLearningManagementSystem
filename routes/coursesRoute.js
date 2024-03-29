const {Router} = require("express")
const {studentLeave,tutorLeave,createCourse,deleteCourse,searchCourses,getContents,contentAccess, listCourses,getCourseDetails, registerToCourse, teachCourse, addContent, listStudentCourses, listTutorCourses, readFile, deleteContent} = require("../controllers/courseControllers")
const {course,evaluate} = require("../controllers/contentControllers")
const {addAssignment,deleteAssignment,submitAssignment,gradeAssignment,deleteSubmission, showGrades,getAssignment,searchSubmission,assignmentAccess,getSubmission,submissionAccess} = require("../controllers/assignmentControllers")
const {upload} = require("../controllers/filesControllers")
const {verifyAccessToken} = require("../controllers/authControllers")

const router = Router()

router.post("/create",verifyAccessToken,createCourse)
router.get("/delete/:id",verifyAccessToken,deleteCourse)
router.post("/delete/:id",verifyAccessToken,deleteCourse)
router.post("/search",verifyAccessToken,searchCourses)
router.get("/:id",verifyAccessToken,getCourseDetails,course)
router.get("/:id/enroll",verifyAccessToken,getCourseDetails,registerToCourse)
router.get("/:id/studentLeave",verifyAccessToken,getCourseDetails,studentLeave)
router.post("/:id/enroll",verifyAccessToken,getCourseDetails,registerToCourse)
router.post("/:id/studentLeave",verifyAccessToken,getCourseDetails,studentLeave)
router.get("/:id/tutor",verifyAccessToken,getCourseDetails,teachCourse)
router.get("/:id/tutorLeave",verifyAccessToken,getCourseDetails,tutorLeave)
router.post("/:id/tutor",verifyAccessToken,getCourseDetails,teachCourse)
router.post("/:id/tutorLeave",verifyAccessToken,getCourseDetails,tutorLeave)
router.post("/:id/addContent",verifyAccessToken,getCourseDetails,upload.array('file'),addContent)
router.post("/:id/addAssignment",verifyAccessToken,getCourseDetails,upload.array('file'),addAssignment)
router.post("/:id/deleteContent/:content",verifyAccessToken,getCourseDetails,deleteContent)
router.get("/:id/deleteAssignment/:assignment",verifyAccessToken,getCourseDetails,deleteAssignment)
router.post("/:id/deleteAssignment/:assignment",verifyAccessToken,getCourseDetails,deleteAssignment)
router.post("/:id/submitAssignment/:assignment",verifyAccessToken,getCourseDetails,upload.array('file'),submitAssignment)
router.post("/:id/showGrades/:assignment",verifyAccessToken,getCourseDetails,showGrades)
router.get("/:id/evaluate/:assignment",verifyAccessToken,getCourseDetails,getAssignment,evaluate)
router.post("/:id/evaluate/:assignment",verifyAccessToken,getCourseDetails,getAssignment,evaluate)
router.post("/:id/gradeAssignment/:assignment/:uname",verifyAccessToken,getCourseDetails,gradeAssignment)
router.post("/:id/deleteSubmission/:assignment/:uname/:submission",verifyAccessToken,getCourseDetails,deleteSubmission)
router.get("/:id/searchSubmission/:assignment",verifyAccessToken,getCourseDetails,getAssignment,searchSubmission)
router.post("/:id/searchSubmission/:assignment",verifyAccessToken,getCourseDetails,getAssignment,searchSubmission)
router.get("/:id/files/:file",verifyAccessToken,getCourseDetails,readFile)
router.get("/:id/assignments/:assignment/:file",verifyAccessToken,getCourseDetails,getAssignment,assignmentAccess,readFile)
router.get("/:id/assignments/:assignment/:submission/:file",verifyAccessToken,getCourseDetails,getAssignment,getSubmission,submissionAccess,readFile)
router.get("/:id/contents/:content/:file",verifyAccessToken,getCourseDetails,getContents,contentAccess,readFile)

module.exports = router