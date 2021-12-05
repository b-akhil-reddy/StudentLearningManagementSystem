const { users } = require("../models/users");

const getUserDetails = async (req,res,next)=>{
    try{
        var c = await users.findOne({userName: req.params.id},{_id:0,password:0,salt:0,__v:0})
        if(c){
            req.data=await JSON.parse(JSON.stringify(c));
            next();
        }else{
            req.flash("error","User details not available")
            res.redirect("/")
        }
    }catch(e){
        console.log(e)
        req.flash("error","Could not get the user details")
        res.redirect("/")
    }
}

module.exports ={
    getUserDetails
}