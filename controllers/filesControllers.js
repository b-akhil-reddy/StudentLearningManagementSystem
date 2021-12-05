const mongoose = require("mongoose")
const path=require("path");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const gridfsStream = require("gridfs-stream");
const crypto = require("crypto");

require('dotenv').config()
const conn = mongoose.createConnection(process.env.MONGO_URL);
let gfs;
conn.once("open", function(){
    gfs= gridfsStream(conn.db,mongoose.mongo)
    gfs.collection("files");
})

var storage = new GridFsStorage({
    url: process.env.MONGO_URL,
    file: (req,file) => {
        return new Promise((resolve,reject)=>{
            crypto.randomBytes(16,(err,buf)=>{
                if(err){
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileinfo={
                    filename: filename,
                    bucketName: "files"
                };
                resolve(fileinfo);
            })
        })
    }
})
const upload = multer({storage});
module.exports ={
    upload,
}