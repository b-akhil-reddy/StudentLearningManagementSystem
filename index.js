const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const http = require('http')
const {Server} = require('socket.io')
const bodyParser = require("body-parser");
const authRoute = require("./routes/authRoutes")
const contentRoutes = require("./routes/contentRoutes")
const coursesRoute = require("./routes/coursesRoute")
const userRoutes = require("./routes/userRoutes")
const noticeRoutes = require("./routes/noticeRoute")
const commonRoutes = require("./routes/commonRoutes")
const session = require('express-session');
const flash = require('connect-flash');

require('dotenv').config()
const app = express();
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false
  }))
app.use(flash())

app.set("view engine","ejs");

app.use('/authentication',authRoute)
app.use('/courses',coursesRoute)
app.use('',contentRoutes)
app.use('/users',userRoutes)
app.use('/notice',noticeRoutes)
app.use('/public',commonRoutes)

const server=http.createServer(app)
const io = new Server(server)
io.on('connection',(socket)=>{
    socket.on('addedNotice',(data)=>{
        io.sockets.emit('appendNotice',data)
    })
    socket.on('deletedNotice',(data)=>{
        io.sockets.emit('deleteNotice',data)
    })
})
mongoose.connect(process.env.MONGO_URL, { useUnifiedTopology : true, useNewUrlParser : true } )
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log('Server Started at port', process.env.PORT);
        })
    })
    .catch(err => console.log(err))