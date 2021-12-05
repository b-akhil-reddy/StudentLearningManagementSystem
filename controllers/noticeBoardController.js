const {noticeBoard} = require("../models/noticeBoard")
const crypto = require('crypto')
const mongoose = require("mongoose")
const allMessages = (req,res,next)=>{
    try{
        noticeBoard.find({}).then((d)=>{
            req.notices=d
            next()
        })
    }catch(e){
        console.log(e)
        req.error="Error at the server side please come back later"
        next()
    }
}

const addNotice = (req,res)=>{
    try{
        const {noticeTitle,noticeDescription} = req.body
        const files=req.files
        const noticeAuthor=req.user["userName"]
        const noticeDate= new Date()
        const notice = new noticeBoard({
            noticeId: crypto.randomBytes(16).toString('hex'),
            noticeTitle: noticeTitle,
            noticeDescription: noticeDescription,
            noticeAuthor: noticeAuthor,
            noticeDate: noticeDate,
            files: files
        })
        notice.save().then((d)=>{
            if(d!=undefined){
                res.send(notice)
            }else{
                res.send({"error":"Not posted notice successfully"})
            }
        })
    }catch(e){
        console.log(e)
        res.json({"error": "Error at the server side please come back later"})
    }
}

const deleteNotice = (req,res)=>{
    try{
        const {notice} = req.params
        const username=req.user["userName"]
        noticeBoard.findOne({noticeId:notice}).then((d)=>{
            if(d.noticeAuthor==username){
                d.files.forEach(element => {
                    mongoose.connection.db.collection("files.files").findOne({filename : element["filename"]}).then((f)=>{
                        mongoose.connection.db.collection("files.files").deleteOne({filename : f["filename"]})        
                        mongoose.connection.db.collection("files.chunks").deleteMany({files_id: f._id})
                    })
                });
                noticeBoard.deleteOne({noticeId:notice,noticeAuthor:username}).then(()=>{
                    res.send({"success": "Successfully deleted notice","noticeId":notice})
                })
            }else{
                res.send({"error": "Permission denied to delete the notice"})
            }
        })
    }catch(e){
        console.log(e)
        res.send({"error": "Error at the server side please come back later"})
    }
}

module.exports = {
    allMessages,
    addNotice,
    deleteNotice
}