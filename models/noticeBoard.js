const mongoose = require("mongoose");

const notice = mongoose.Schema({
    noticeId: String,
    noticeTitle: String,
    noticeDescription: String,
    noticeAuthor: String,
    noticeDate: Date,
    files: [Object]
})

const noticeBoard = mongoose.model('noticeBoard', notice);

module.exports = {
    noticeBoard
}