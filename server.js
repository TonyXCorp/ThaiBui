const express = require('express')
const child = require('child_process').spawn
var bodyParser = require("body-parser");
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');
const db = require('./database')


const app = express()
var server = require("http").Server(app);
app.set("view engine", "ejs")
app.set("views", "./views")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'something' }));
app.use(passport.initialize());
app.use(passport.session());




passport.use(new localStrategy({
    usernameField: 'password',
    passwordField: 'password'
},
    (username, password, done) => { //các tên - name trường cần nhập, đủ tên trường thì Done 
        if (password == "1") {

            return done(null, "Administrator")
        }
        else {
            return done(null, false)
        }
    }
))

passport.serializeUser((admin, done) => {

    done(null, admin);
})
passport.deserializeUser((admin, done) => {
    if (admin == 'Administrator') {
        return done(null, "Administrator")
    } else {
        console.log("Err")
        return done(null, false)
    }
})

app.get("/execute", (req, res) => {
    abs_link = "./video.mp4"
    username = "an8amc1234"
    password = "tonyparker2003"
    title = "title"
    drive_url = "google.com"
    description = "description"
    var process = child('python', ["./script.py", abs_link, username + ":"+ password, title, description])
    process.stdout.on('data', (data) => {
        if(data.toString() = "Done"){
            db.addVideo(drive_url, title, description, )
        }
    })
})

app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        db.count((videos, accounts)=>{
            //Hiện lên màn hình thông tin về số lượng acc, video
            console.log("Number of accounts: " + accounts)
            console.log("Number of videos: " + videos)
            //videos là số lượng video
            //accounts là số lượng account
        })
        res.render('index')
    }
    else {
        res.render('login', { error: "" })
    }
})
app.get("/video-list", (req, res) => {
    if (req.isAuthenticated()) {
        db.getVideos(data=>{
            console.log(data)
            //Data cho list video
        })
        res.render('listvideo')
    }
    else {
        res.render("login", {error: "Please login first"})
    }
})
app.get("/video-search", (req, res) => {
    if (req.isAuthenticated()) {
        res.render('searchvideo')
    }
    else {
        res.render("login", {error: "Please login first"})
    }
})

app.get("/account-list", (req, res) => {
    if (req.isAuthenticated()) {
        db.getAccounts(data=>{
            console.log(data);
            //Data cho list account
        })
        res.render('listaccount')
    }
    else {
        res.render("login", {error: "Please login first"})
    }
})
app.get("/account-add", (req, res) => {
    if (req.isAuthenticated()) {
        res.render('addaccount')
    }
    else {
        res.render("login", {error: "Please login first"})
    }
})
app.post("/account-add", (req, res)=>{

})

app.get("/add-link", (req, res) => {
    if (req.isAuthenticated()) {
        res.render('addlink')
    }
    else {
        res.render("login", {error: "Please login first"})
    }
})
app.get("/upload-video", (req, res) => {
    if (req.isAuthenticated()) {
        res.render('uploadvideo')
    }
    else {
        res.render("login", {error: "Please login first"})
    }
})
app.post("/login", passport.authenticate('local', { //chọn phương thức check là local => npm install passport-local
    failureRedirect: '/loginFail',  //nếu check không đúng thì redirect về link này
    successRedirect: '/'
}))

app.get("/loginFail", (req, res) => {
    res.render("login", {
        error: "Wrong password, please try again !"
    })
})

io.on("connection", (socket)=>{
    socket.on('video_list', (data)=>{
        db.getVideos(data=>{
            io.emit("video_list", data)
        })
    })
    socket.on('account_list', (data)=>{
        db.getAccounts(data=>{
            io.emit("account_list",data)
        })
    })
    socket.on('video-search', (data)=>{
        db.search(data, (result)=>{
            io.emit("search", result)
        })
    })
})

server.listen(1212)