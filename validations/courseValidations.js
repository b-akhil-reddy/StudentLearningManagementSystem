function contentValidation(data){
    out=true
    if(data["contentTitle"]==undefined||data["contentTitle"]==""){
        out=out&&false
    }else{
        data["contentTitle"]=data["contentTitle"].replace(/[ ]{2,}/g,' ')
        out=out&&true
    }
    return out
}

const validateContent = (req,res,next) => {
    validation=contentValidation(req.body)
    if(validation){
        next()
    }else{
        req.flash("error","Couldn't add content because of invalid inputs")
        res.send({"error":"Couldn't add content because of invalid inputs"})
    }
}

module.exports = {
    validateContent
}