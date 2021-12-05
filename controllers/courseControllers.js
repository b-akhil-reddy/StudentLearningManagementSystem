const {courses} = require("../models/courses");
const mongoose = require("mongoose")
const crypto = require("crypto")
const gridfsStream = require("gridfs-stream");
const createCourse = async(req,res)=>{
    const {courseName, description} = await req.body;
    try{
        if(courseName!=undefined&&courseName!=""){
            const c = await new courses({
                courseId: crypto.randomBytes(16).toString('hex'),
                courseName: courseName,
                description: description,
            })
            await c.save()
            req.flash("success","Course created successfully")
            res.redirect("/")
        }else{
            req.flash("error","Course Name is required")
            res.redirect("/")
        }
    }catch(e){
        console.log(e)
        req.flash("error","Error from server side come back later")
        res.redirect("/")
    }
}

const studentLeave = async (req,res) =>{
    try{
        const username =await req.user["userName"]
        const courseId =await req.course["courseId"]
        if(req.course["students"].includes(username)){
            await courses.updateOne({courseId: courseId},{$pull : {students: username}})
            req.flash("success","You have left the course "+req.course["courseName"])
            res.redirect("/courses/"+courseId)
        }else{
            req.flash("error","You are not the student of the course "+req.course["courseName"])
            res.redirect("/courses/"+courseId)
        }
    }catch(e){
        console.log(e)
        req.flash("error","Could not leave from the course")
        res.redirect("/")
    }
}

const tutorLeave= async (req,res)=>{
    try{
        const username =await req.user["userName"]
        const courseId =await req.course["courseId"]
        if(req.course["tutor"].includes(username)){
            await courses.updateOne({courseId: courseId},{$pull : {tutor: username}})
            req.flash("success","You have left the course "+req.course["courseName"])
            res.redirect("/courses/"+courseId)
        }else{
            req.flash("error","You are not the tutor of the course "+req.course["courseName"])
            res.redirect("/courses/"+courseId)
        }
    }catch(e){
        console.log(e)
        req.flash("error","Could not leave from the course")
        res.redirect("/")
    }
}

const searchCourses = (req,res) =>{
    try{
        const {courseName,description} = req.body;
        if(courseName!=undefined&&description!=undefined){
            courses.find({courseName:{$regex: courseName},description: {$regex: description}},{_id: 0,courseId:1,courseName:1,description:1}).then((d)=>{
                res.send(d)
            })
        }else if(courseName!=undefined){
            courses.find({courseName:{$regex: courseName}},{_id: 0,courseId:1,courseName:1,description:1}).then((d)=>{
                res.send(d)
            })
        }else if(description!=undefined){
            courses.find({description:{$regex: description}},{_id: 0,courseId:1,courseName:1,description:1}).then((d)=>{
                res.send(d)
            })
        }else{
            res.send({"error":"Atleast one of the inputs must be specified"})
        }
    }catch(e){
        console.log(e)
        res.send({"error":"Error at server side please come back later"})
    }
}

const deleteCourse = async (req,res)=>{
    const {id} = await req.params;
    try{
        await courses.deleteOne({courseId:id})
        req.flash("success","Course delete successfully")
        res.redirect("/")
    }catch(e){
        console.log(e)
        req.flash("error","Course not deleted")
        res.redirect("/")
    }
}

const listCourses = async (req,res,next)=>{
    try{
        var c = await courses.find({},{_id: 0,courseId:1,courseName:1,description:1})
        req.courses = c
        next()
    }catch(e){
        console.log(e)
        req.error = "Could not list the courses"
        next()
    }
}

const listStudentCourses = async (req,res,next)=>{
    try{
        if(req.user==undefined){
            next()
        }else{
            var c = await courses.find({students:{$in: [ req.user["userName"] ]}},{_id: 0,courseId:1,courseName:1,description:1})
            req.studentCourses=c
            next()
        }
    }catch(e){
        console.log(e)
        req.error = "Could not list the courses"
        next()
    }
}

const listTutorCourses = async (req,res,next)=>{
    try{
        if(req.user==undefined){
            next()
        }else{
            var c = await courses.find({tutor:{$in: [ req.user["userName"] ]}},{_id: 0,courseId:1,courseName:1,description:1})
            req.tutorCourses=c
            next()
        }
    }catch(e){
        console.log(e)
        req.error = "Could not list the courses"
        next()
    }
}

const getCourseDetails = async (req,res,next)=>{
    try{
        var c = await courses.findOne({courseId: req.params.id})
        if(c){
            req.course=c;
            next();
        }else{
            req.flash("error","Course details not available")
            res.redirect("/").end()
        }
    }catch(e){
        console.log(e)
        req.flash("error","Could not get the course details")
        res.redirect("/").end()
    }
}

const registerToCourse = async (req,res)=>{
    try{
        const username =await req.user["userName"]
        const courseId =await req.course["courseId"]
        if(!req.course["students"].includes(username)){
            await courses.updateOne({courseId: courseId},{$push : {students: username}})
            req.flash("success","You have enrolled in the course "+req.course["courseName"])
            res.redirect("/courses/"+courseId)
        }else{
            req.flash("error","You have already enrolled in the course "+req.course["courseName"])
            res.redirect("/courses/"+courseId)
        }
    }catch(e){
        console.log(e)
        req.flash("error","Could not enroll in the course")
        res.redirect("/")
    }
}
const teachCourse = async (req,res)=>{
    try{
        const username =await req.user["userName"]
        const courseId =await req.course["courseId"]
        if(!req.course["tutor"].includes(username)){
            await courses.updateOne({courseId: courseId},{$push : {tutor: username}})
            req.flash("success","You have enrolled in the course "+req.course["courseName"]+" as a tutor")
            res.redirect("/courses/"+courseId)
        }else{
            req.flash("error","You have already enrolled in the course "+req.course["courseName"]+" as a tutor")
            res.redirect("/courses/"+courseId)
        }
    }catch(e){
        console.log(e)
        req.flash("error","Could not enroll in the course")
        res.redirect("/")
    }
}

const deleteContent = async (req,res) =>{
    const username = await req.user["userName"]
    const courseId = await req.course["courseId"]
    const {content} = await req.params;
    try{
        var temp=await courses.findOne({courseId: courseId, tutor:{$in:[username]}})
        temp = await temp["data"]
        f=await temp.find((c,index) => {
            if(c["contentId"]==content){
                return true
            }
        })
        f=await f["files"]
        await f.forEach(element => {
            mongoose.connection.db.collection("files.files").findOne({filename : element["filename"]}).then((f)=>{
                mongoose.connection.db.collection("files.files").deleteOne({filename : f["filename"]})        
                mongoose.connection.db.collection("files.chunks").deleteMany({files_id: f._id})
            })
        });
        await courses.updateOne({courseId: courseId,tutor:{$in:[username]}},{
            $pull : {
                data: {
                        "contentId": await content
                    }
                }
            })
        req.flash("success","Delete content successfully")
        res.redirect("/courses/"+courseId)
    }catch(e){
        console.log(e)
        req.flash("error","Content not deleted successfully")
        res.redirect("/courses/"+courseId)
    }
}

const addContent = (req,res) =>{
    const {contentTitle, contentDescription} = req.body;
    const contentId = crypto.randomBytes(16).toString('hex')
    const username =req.user["userName"]
    const courseId =req.course["courseId"]
    const files=req.files
    try{
        if(contentTitle!=undefined&&contentTitle!=""){
            courses.updateOne({courseId: courseId,tutor:{$in:[username]}},{
                $push : {
                    data: {
                            contentId: contentId,
                            contentTitle:contentTitle,
                            contentDescription:contentDescription,
                            files: files
                        }
                    }
                }).then(()=>{
                    req.flash("success","Added content successfully")
                    res.send({"success":"Added content successfully"})
                })
        }else{
            if(files!=undefined&&files.length!=0){
                files.forEach(file => {
                    mongoose.connection.db.collection("files.files").findOne({filename : file["filename"]}).then((f)=>{
                        mongoose.connection.db.collection("files.files").deleteOne({filename : f["filename"]})        
                        mongoose.connection.db.collection("files.chunks").deleteMany({files_id: f._id})
                    })
                })
            }
            req.flash("error","Content Title cannot be empty")
            res.send({"error":"Content Title cannot be empty"})            
        }
    }catch(e){
        console.log(e)
        req.flash("error","Content not created successfully")
        res.send({"error":"Content not created successfully"})
    }
}

const readFile = (req,res) =>{
    try{
        const conn = mongoose.createConnection(process.env.MONGO_URL);
        let gfs;
        conn.once("open", function(){
            gfs= gridfsStream(conn.db,mongoose.mongo)
            gfs.collection("files");
        }).then(()=>{
            if(req.course["students"].includes(req.user["userName"])||req.course["tutor"].includes(req.user["userName"])){
                gfs.files.findOne({filename: req.params.file},(err,file)=>{
                    if(!file||file.length===0){
                        return res.status(404).json({
                            msg: "No such file exists"
                        })
                    }
                    var readstream = gfs.createReadStream(file.filename);
                    readstream.pipe(res)
                })
            }else{
                req.flash("error","Permission Denied")
                res.send({error: "Permission Denied"})
            }
        })
    }catch(e){
        console.log(e)
        req.flash("error","Permission Denied")
        res.send({error: "Permission Denied"})
    }
}

const getContents = (req,res,next) =>{
    if(req.user!=undefined){
        const {content} = req.params
        const {userName} = req.user
        const {tutor,students,data,courseId} = req.course
        if(tutor.includes(userName)||students.includes(userName)){
            data.forEach((a)=>{
                if(a["contentId"]==content){
                    req.content=a
                    next()
                }
            })
        }else{
            req.flash("error","Permission Denied")
            res.redirect("/courses/"+courseId)
        }
    }else{
        req.flash({"error": "Permission Denied"})
        res.redirect("/courses/"+req.course["courseId"])
    }
}

const contentAccess = (req,res,next) =>{
    const {file}=req.params
    const {userName} = req.user
    const {files} = req.content
    const {courseId} = req.course
    if(req.course.tutor.includes(userName)||req.course.students.includes(userName)){
        out=files.filter((f)=>{
            return f.filename==file
        })
        if(out.length==1){
            next()
        }else{
            req.flash("error", "Permission Denied")
            res.redirect("/courses/"+courseId)
        }
    }else{
        req.flash("error", "Permission Denied")
        res.redirect("/courses/"+courseId)
    }
}

module.exports = {
    createCourse,
    deleteCourse,
    listCourses,
    getCourseDetails,
    registerToCourse,
    teachCourse,
    addContent,
    listStudentCourses,
    listTutorCourses,
    readFile,
    deleteContent,
    searchCourses,
    studentLeave,
    tutorLeave,
    getContents,
    contentAccess
}