function validate(data){
    out=true
    if(data["userName"]==undefined||data["userName"]==""){
        out=out&&false
    }else{
        data["userName"]=data["userName"].replace(/[ ]{2,}/g,' ')
        out=out&&true
    }
    if(data["password"]==undefined||data["password"]==""){
        out=out&&false
    }else{
        data["password"]=data["password"].replace(/[ ]{2,}/g,' ')
        err=""
        if(data["password"].length<8){
            err+="Password must have atleast 8 characters<br>"
        }
        if(data["password"].match(/.*[a-z]+.*/)==null){
            err+="Password must have atleast 1 Lowercase character<br>"
        }
        if(data["password"].match(/.*[A-Z]+.*/)==null){
            err+="Password must have atleast 1 Uppercase character<br>"
        }
        if(data["password"].match(/.*[\d]+.*/)==null){
            err+="Password must have atleast 1 Number<br>"
        }
        if(data["password"].match(/.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+.*/)==null){
            err+=`Password must have atleast 1 Special character( !"#$%&'()*+,-./:;<=>?@[\]^_\`{|}~)<br>`
        }
        if(err==""){
            out=out&&true
        }else{
            out=out&&false
        }
    }
    if(data["initial"]==undefined||data["initial"]==""){
        out=out&&false
    }else{
        data["initial"]=data["initial"].replace(/[ ]{2,}/g,' ')
        out=out&&true
    }
    if(data["firstName"]==undefined||data["firstName"]==""){
        out=out&&false
    }else{
        data["firstName"]=data["firstName"].replace(/[ ]{2,}/g,' ')
        out=out&&true
    }
    if(data["lastName"]==undefined||data["lastName"]==""){
        out=out&&false
    }else{
        data["lastName"]=data["lastName"].replace(/[ ]{2,}/g,' ')
        out=out&&true
    }
    if(data["userType"]==undefined||data["userType"]==""){
        out=out&&false
    }else{
        data["userType"]=data["userType"].replace(/[ ]{2,}/g,' ')
        out=out&&true
    }
    if(data["email"]==undefined||data["email"]==""){
        out=out&&false
    }else{
        data["email"]=data["email"].replace(/[ ]{2,}/g,' ')
        if(data["email"].match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/)==null){
            out=out&&false
        }else{
            out=out&&true
        }
    }
    if(data["mobile"]==undefined||data["mobile"]==""){
        out=out&&false
    }else{
        data["mobile"]=data["mobile"].replace(/[ ]{2,}/g,' ')
        if(data["mobile"].match(/^[\d]{10}$/)==null){
            out=out&&false
        }else{
            out=out&&true
        }
    }
    return out
}

function changePasswordValidate(data){
    out=true
    if(data["userName"]==undefined||data["userName"]==""){
        out=out&&false
    }else{
        data["userName"]=data["userName"].replace(/[ ]{2,}/g,' ')
        out=out&&true
    }
    if(data["newpassword"]==undefined||data["newpassword"]==""){
        out=out&&false
    }else{
        data["newpassword"]=data["newpassword"].replace(/[ ]{2,}/g,' ')
        err=""
        if(data["newpassword"].length<8){
            err+="newpassword must have atleast 8 characters<br>"
        }
        if(data["newpassword"].match(/.*[a-z]+.*/)==null){
            err+="newpassword must have atleast 1 Lowercase character<br>"
        }
        if(data["newpassword"].match(/.*[A-Z]+.*/)==null){
            err+="newpassword must have atleast 1 Uppercase character<br>"
        }
        if(data["newpassword"].match(/.*[\d]+.*/)==null){
            err+="newpassword must have atleast 1 Number<br>"
        }
        if(data["newpassword"].match(/.*[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+.*/)==null){
            err+=`newpassword must have atleast 1 Special character( !"#$%&'()*+,-./:;<=>?@[\]^_\`{|}~)<br>`
        }
        if(err==""){
            out=out&&true
        }else{
            out=out&&false
        }
    }
    return out
}

const signupValidations = (req,res,next) => {
    validation=validate(req.body)
    if(validation){
        next()
    }else{
        res.send({"error":"Couldn't register because of invalid inputs"})
    }
}

const changePasswordValidations = (req,res,next) => {
    validation=changePasswordValidate(req.body)
    if(validation){
        next()
    }else{
        res.send({"error":"Couldn't Change Password because of invalid inputs"})
    }
}

module.exports = {
    signupValidations,
    changePasswordValidations
}