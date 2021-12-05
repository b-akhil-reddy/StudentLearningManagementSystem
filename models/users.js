const mongoose = require("mongoose")
// const {courses} = require('./courses');

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    initial: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    mobile: {
        type: String,
        unique: true,
        required: true,
    },
    salt: {
        type: String,
        required: true
    }
})
const users = mongoose.model('users', userSchema);

// const studentOfShema = mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'users'
//     },
//     courseId: [courses]
// })
// const studentOf = mongoose.model('studentOf', studentOfShema);

// const tutorOfShema = mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'users'
//     },
//     courseId: [courses]
// })
// const tutorOf = mongoose.model('tutorOf', tutorOfShema);

module.exports = {
    users,
    // studentOf,
    // tutorOf
}