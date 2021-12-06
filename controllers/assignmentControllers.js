const {courses} = require("../models/courses");
const crypto = require("crypto");
const mongoose = require("mongoose")

const deleteAssignment = async (req,res) =>{
    const username = await req.user["userName"]
    const courseId = await req.course["courseId"]
    const {assignment} = await req.params;
    try{
        var temp=await courses.findOne({courseId: courseId, tutor:{$in:[username]}})
        temp = await temp["assignments"]
        f=await temp.find((c,index) => {
            if(c["assignmentId"]==assignment){
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
                assignments: {
                        "assignmentId": await assignment
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

const addAssignment = (req,res) =>{
    const {assignmentTitle, assignmentDescription, startDate, endDate} = req.body;
    const assignmentId = crypto.randomBytes(16).toString('hex')
    const username =req.user["userName"]
    const courseId =req.course["courseId"]
    const files=req.files
    try{
        if(assignmentTitle!=undefined&&assignmentTitle!=""){
            courses.updateOne({courseId: courseId,tutor:{$in:[username]}},{
                $push : {
                    assignments: {
                            assignmentId: assignmentId,
                            assignmentTitle: assignmentTitle,
                            assignmentDescription: assignmentDescription,
                            files: files,
                            submissions: [],
                            startDate:startDate,
                            endDate:endDate,
                        }
                    }
                }).then(()=>{
                    req.flash("success","Added content successfully")
                    res.redirect("/courses/"+courseId)
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
            req.flash("error","Assignment Title cannot be empty")
            res.send({"error":"Assignment Title cannot be empty"})            
        }
    }catch(e){
        console.log(e)
        req.flash("error","Content not created successfully")
        res.redirect("/courses/"+courseId)
    }
}

const submitAssignment = (req,res)=>{
    const {description} = req.body;
    const username =req.user["userName"]
    const courseId =req.course["courseId"]
    const {assignment} = req.params
    const files=req.files
    try{
        if(Array.isArray(files)&&files.length>0){
            courses.updateOne({courseId: courseId,$or: [{students:{$in:[username]}},{tutor:{$in: [username]}}]},{
                $push : {
                    "assignments.$[f].submissions": {
                        submissionId: crypto.randomBytes(16).toString("hex"),
                        userId: username,
                        files: Array.isArray(files)?files:[files],
                        description: description,
                        submissionTime: new Date()
                    }
                }
            },{arrayFilters: [{"f.assignmentId" : assignment}]}).then(()=>{
                req.flash("success","Submitted successfully")
                res.send({"success":"Submitted successfully"})
            })
        }else{
            req.flash("error","Atleast one file must be submitted")
            res.send({"error":"Atleast one file must be submitted"})
        }
    }catch(e){
        console.log(e)
        req.flash("error","Not submitted successfully")
        res.send({"error":"Error at server side please try again after sometime"})
    }
}

const gradeAssignment = (req,res)=>{
    const {marks}=req.body
    const {assignment,uname} = req.params
    const {courseId} = req.course
    const {userName} = req.user
    try {
        courses.updateOne({courseId: courseId,tutor:{$in:[userName]}, "assignments.assignmentId" : assignment},{
            $set: {
                [`assignments.$[f].grades.${uname}`]:marks
            }
        },{arrayFilters: [{"f.assignmentId":assignment}]}).then(()=>{
            req.flash("success","Changed grades of selected person")
            res.redirect("/courses/"+courseId+"/evaluate/"+assignment)
        })
    } catch (error) {
        console.log(error)
        req.flash("error","Error occured while grading")
        res.redirect("/courses/"+courseId+"/evaluate/"+assignment)
    }
}

const searchSubmission = (req,res)=>{
    const {userName,userType} = req.user
    const {userId} = req.body
    const {submissions,grades,endDate} = req.assignment
    if(req.course.tutor.includes(userName)){
        t=submissions.filter((ele)=>{
            if(ele["userId"].indexOf(userId)>=0){
                return true                
            }
        })
        res.send({data: t,grades: grades,endDate:endDate})
    }else{
        res.send({"error": "Permission Denied"})
    }
}

const showGrades = (req,res)=>{
    const {assignment} = req.params
    const {courseId} = req.course
    const {userName} = req.user
    try {
        courses.findOne({courseId: courseId,tutor:{$in:[userName]}}).then((d)=>{
            d=d["assignments"].find((t)=>{
                if(t.assignmentId==assignment){
                    return true
                }
            })
            courses.updateOne({courseId: courseId,tutor:{$in:[userName]}},{
                $set: {
                    "assignments.$[f].gradesVisibility": !d["gradesVisibility"]
                }
            },{arrayFilters: [{"f.assignmentId":assignment}]})
            .then(()=>{
                req.flash("success","Visibility of grades changed")
                res.redirect("/courses/"+courseId)
            })
        })
    } catch (error) {
        console.log(error)
        req.flash("error","Error occured while changing visibility of grades")
        res.redirect("/courses/"+courseId)
    }
}


const deleteSubmission = (req,res)=>{
    const {assignment,uname,submission} = req.params
    const {courseId} = req.course
    const {userName} = req.user
    try {
        if(uname==userName){
            courses.findOne({courseId: courseId,$or: [{students:{$in:[uname]}},{tutor: {$in: [uname]}}]}).then((d)=>{
                d=d["assignments"].find((t)=>{
                    if(t.assignmentId==assignment){
                        return true
                    }
                })
                d=d["submissions"].find((t)=>{
                    if(t.submissionId==submission&&t.userId==uname){
                        return true
                    }
                })
                if(d!=undefined){
                    d=d["files"]
                    d.forEach(element => {
                        mongoose.connection.db.collection("files.files").findOne({filename : element["filename"]}).then((f)=>{
                            mongoose.connection.db.collection("files.files").deleteOne({filename : f["filename"]})        
                            mongoose.connection.db.collection("files.chunks").deleteMany({files_id: f._id})
                        })
                    });
                }
            })
            courses.updateOne({courseId: courseId,$or: [{students:{$in:[uname]}},{tutor: {$in: [uname]}}]},{
                $pull: {
                    "assignments.$[f].submissions":{
                        userId: uname,
                        submissionId: submission
                    }
                }
            },{arrayFilters: [{"f.assignmentId" : assignment}]}).then((d)=>{
                if(d.nModified==0){
                    req.flash("error","Not deleted Successfully")
                    res.redirect("/courses/"+courseId)
                }else{
                    req.flash("success","Deleted Submission Successfully")
                    res.redirect("/courses/"+courseId)
                }
            })
        }else{
            courses.findOne({courseId: courseId,$or: [{students:{$in:[uname]}},{tutor: {$in: [uname]}}], "assignments.assignmentId" : assignment}).then((d)=>{
                d=d["assignments"].find((t)=>{
                    if(t.assignmentId==assignment){
                        return true
                    }
                })
                d=d["submissions"].find((t)=>{
                    if(t.submissionId==submission&&t.userId==uname){
                        return true
                    }
                })
                if(d!=undefined){
                    d=d["files"]
                    d.forEach(element => {
                        mongoose.connection.db.collection("files.files").findOne({filename : element["filename"]}).then((f)=>{
                            mongoose.connection.db.collection("files.files").deleteOne({filename : f["filename"]})        
                            mongoose.connection.db.collection("files.chunks").deleteMany({files_id: f._id})
                        })
                    });
                }
            })
            courses.updateOne({courseId: courseId,$or: [{students:{$in:[uname]}},{tutor: {$in: [uname]}}]},{
                $pull: {
                    "assignments.$[].submissions":{
                        userId: uname,
                        submissionId: submission
                    }
                }
            },{arrayFilters: [{"assignments.assignmentId" : assignment}]}).then((d)=>{
                if(d.nModified==0){
                    req.flash("error","Not deleted Successfully")
                    res.redirect("/courses/"+courseId)
                }else{
                    req.flash("success","Deleted Submission Successfully")
                    res.redirect("/courses/"+courseId)
                }
            })
        }
    } catch (error) {
        console.log(error)
        req.flash("error","Error occured while grading")
        res.redirect("/courses/"+courseId)
    }
}

const getAssignment = (req,res,next) =>{
    if(req.user!=undefined){
        const {assignment} = req.params
        const {userName} = req.user
        const {tutor,students,assignments,courseId} = req.course
        if(tutor.includes(userName)||students.includes(userName)){
            assignments.forEach((a)=>{
                if(a["assignmentId"]==assignment){
                    req.assignment=a
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

const assignmentAccess = (req,res,next) =>{
    const {assignment} = req
    const {file}=req.params
    const {userName} = req.user
    const {files} = req.assignment
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

const getSubmission = (req,res,next) =>{
    if(req.user!=undefined){
        const {submission} = req.params
        const {userName} = req.user
        const {assignment}=req
        const {tutor,students,courseId} = req.course
        if(tutor.includes(userName)||students.includes(userName)){
            assignment["submissions"].forEach((s)=>{
                if(s["submissionId"]==submission){
                    req.submission=s
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

const submissionAccess = (req,res,next) =>{
    const {submission} = req
    const {file}=req.params
    const {userName} = req.user
    const {files} = req.submission
    const {courseId} = req.course
    if(req.course.tutor.includes(userName)||submission['userId']==userName){
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
    addAssignment,
    deleteAssignment,
    submitAssignment,
    gradeAssignment,
    deleteSubmission,
    showGrades,
    getAssignment,
    getSubmission,
    searchSubmission,
    assignmentAccess,
    submissionAccess
}