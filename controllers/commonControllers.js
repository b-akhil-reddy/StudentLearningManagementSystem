const mongoose = require("mongoose")
const gridfsStream = require("gridfs-stream");

const publicFile = (req,res)=>{
    const conn = mongoose.createConnection(process.env.MONGO_URL);
    let gfs;
    conn.once("open", function(){
        gfs= gridfsStream(conn.db,mongoose.mongo)
        gfs.collection("files");
    }).then(()=>{
        gfs.files.findOne({filename: req.params.file},(err,file)=>{
            if(!file||file.length===0){
                return res.status(404).json({
                    msg: "No such file exists"
                })
            }
            var readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res)
        })
    })
}
module.exports ={
    publicFile
}