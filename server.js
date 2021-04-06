const express = require('express')
const child = require('child_process').spawn
var bodyParser = require("body-parser");
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');


const app = express()
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
    var process = child('python', ["./script.py", "./video.mp4", "an8amc1234:tonyparker2003", "title", "des"])
    process.stdout.on('data', (data) => {
        reg = /Done/.exec(data)
        if (reg != null) {
            res.send(reg[0])
        }
    })
})

app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.render('index')
    }
    else {
        res.render('login', { error: "" })
    }
})
app.get("/video-list", (req, res) => {
    if (req.isAuthenticated()) {
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
    successRedirect: '/loginOK'
}))

app.get("/loginOK", (req, res) => {
    res.render('index')
})
app.get("/loginFail", (req, res) => {
    res.render("login", {
        error: "Wrong password, please try again !"
    })
})
app.listen(1212)