const index = (req,res)=>{
    res.render("index",{location: req.url,user:req.user,courses:req.courses,studentCourses:req.studentCourses,tutorCourses:req.tutorCourses,error:req.flash("error"),success:req.flash("success")})
}

const login = (req,res)=>{
    if(req.user){
        res.redirect("/")
    }else{
        res.render("login",{location: req.url,user:req.user,error:req.flash("error"),success:req.flash("success")})
    }
}

const resetPassword = (req,res)=>{
    if(req.user){
        res.redirect("/")
    }else{
        res.render("resetPassword",{location: req.url,user:req.user,error:req.flash("error"),success:req.flash("success")})
    }
}
const changePassword = (req,res)=>{
    if(req.user){
        res.redirect("/")
    }else{
        res.render("changePassword",{location: req.url,user:req.user,error:req.flash("error"),success:req.flash("success")})
    }
}

const register = (req,res)=>{
    if(req.user){
        res.redirect("/")
    }else{
        res.render("register",{location: req.url,user:req.user,error:req.flash("error"),success:req.flash("success")})
    }
}

const course = (req,res) => {
    if(req.user){
        res.render("course/course",{location: req.url,user:req.user,course:req.course,error:req.flash("error"),success:req.flash("success")})
    }else{
        req.flash("error","You need to login to access the content")
        res.redirect("/login")
    }
}

const evaluate = (req,res) => {
    if(req.user){
        res.render("course/evaluation",{location: req.url,user:req.user,assignment:req.assignment,course:req.course,error:req.flash("error"),success:req.flash("success")})
    }else{
        req.flash("error","You need to login to access the content")
        res.redirect("/login")
    }
}

const user = (req,res) => {
    if(req.user){
        res.render("users/user",{location: req.url,user:req.user,data:req.data,error:req.flash("error"),success:req.flash("success")})
    }else{
        req.flash("error","You need to login to access the content")
        res.redirect("/login")
    }
}

const profile = (req,res) => {
    if(req.user){
        res.render("profile",{location: req.url,user:req.user,data:req.data,error:req.flash("error"),success:req.flash("success")})
    }else{
        req.flash("error","You need to login to access the content")
        res.redirect("/login")
    }
}

const notices = (req,res) => {
    if(req.user){
        res.render("notice",{location: req.url,user:req.user,notices:req.notices,error:req.flash("error"),success:req.flash("success")})
    }else{
        req.flash("error","You need to login to access the content")
        res.redirect("/login")
    }
}
const about = (req,res) => {
    res.render("about",{location: req.url,user:req.user,notices:req.notices,error:req.flash("error"),success:req.flash("success")})
}

module.exports = {
    index,login,register,course,user,notices,evaluate,profile,resetPassword,changePassword,about
}