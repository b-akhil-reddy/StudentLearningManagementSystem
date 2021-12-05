const mongoose = require("mongoose")

const contentSchema = mongoose.Schema({
    contentId: String,
    contentTitle: String,
    contentDescription: String,
    files: [Object]
})

const assignmentSchema = mongoose.Schema({
    assignmentId: String,
    assignmentTitle: String,
    assignmentDescription: String,
    files: [Object],
    submissions: [Object],
    startDate: Date,
    endDate: Date,
    grades: Object,
    gradesVisibility: {
         type: Boolean,
         default: false
    }
})

const courseSchema = mongoose.Schema({
    courseName: {
        type: String,
        required: true
    },
    courseId: {
        type: String,
        unique: true
    },
    description: String,
    tutor: [String],
    students: [String],
    data: [contentSchema],
    assignments: [assignmentSchema]
})

const courses = mongoose.model('courses', courseSchema);

module.exports = {
    courses
}