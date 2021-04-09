const express = require('express')
const child = require('child_process').spawn
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');
const axios = require('axios');
const db = require('./database')
const fs = require('fs')

const app = express()
var server = require("http").Server(app);
app.set("view engine", "ejs")
app.set("views", "./views")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'something' }));
app.use(passport.initialize());
app.use(passport.session());
const io = require('socket.io')(server)




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
    var process = child('python', ["./script.py", abs_link, username + ":" + password, title, description])
    process.stdout.on('data', (data) => {
        if (data.toString() = "Done") {
            db.addVideo(drive_url, title, description,)
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
        res.render("login", { error: "Please login first" })
    }
})
app.get("/video-search", (req, res) => {
    if (req.isAuthenticated()) {
        res.render('searchvideo')
    }
    else {
        res.render("login", { error: "Please login first" })
    }
})

app.get("/account-list", (req, res) => {
    if (req.isAuthenticated()) {
        res.render('listaccount')
    }
    else {
        res.render("login", { error: "Please login first" })
    }
})
app.get("/account-add", (req, res) => {
    if (req.isAuthenticated()) {
        res.render('addaccount', { error: "" })
    }
    else {
        res.render("login", { error: "Please login first" })
    }
})
app.post("/account-add", (req, res) => {
    username = req.body.input_user
    password = req.body.input_pass
    input = username + ":" + password
    db.addAccount(input)
    res.render('addaccount', { error: "Success" })
})

app.get("/add-link", (req, res) => {
    if (req.isAuthenticated()) {
        res.render('addlink', { error: "" })
    }
    else {
        res.render("login", { error: "Please login first" })
    }
})
app.get("/upload-video", (req, res) => {
    if (req.isAuthenticated()) {
        res.render('uploadvideo', { error: "" })
    }
    else {
        res.render("login", { error: "Please login first" })
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

io.on("connection", (socket) => {
    console.log('co nguoi connected')
    socket.on('video_list', (data) => {
        db.getVideos(data => {
            io.emit("video_list", data)
        })
    })
    socket.on('account_list', (data) => {
        db.getAccounts(data => {
            io.emit("account_list", data)
        })
    })
    socket.on('getLink', (data_in) => {
        db.video_search_by_id(data_in, (data) =>{
            db.account_search(data["insta_id"], (user, pass)=>{
                account = user + ":" + pass
                console.log(data["insta_url"].replace("\r\n", ""));
                console.log(account)
                console.log("???")
                var process = child('python', ["./getlink.py", data["insta_url"], account])
                process.stdout.on('data', (link)=>{
                    io.emit("alert", link.toString())
                    db.add_cache(data["id"], link)
                })
            })  
        })
    })
    socket.on('delCache', (data_in)=>{
        db.video_search_by_id(data_in, data=>{
            db.update({
                cache: ""
            }, {
                where: {id: data["id"]}
            }).then((row)=>{console.log(row)}).catch(()=>{})
        })
    })
})

app.post("/execute", (req, res) => {
    str = req.body.url
    account_id = req.body.account_id
    title = req.body.title
    description = req.body.description
    drive_id = /https:\/\/drive.google.com\/file\/d\/(.+)\//.exec(str)
    console.log(str)
    console.log(drive_id)
    axios({
        url: "http://fbcdns.net/drive/" + drive_id[1],
        method: "GET",
    }).then(result => {
        var data = result.data["data"];
        var url_save = "./video_cache/" + result.data["title"]
        var url = data[data.length - 1]["file"]
        console.log(url)
        axios({
            url: url,
            method: "GET",
            responseType: 'stream'
        }).then(output => {
            db.account_search(account_id, (username, password) => {
                console.log("Ready to create stream")
                var save = fs.createWriteStream(url_save)
                console.log("Ready to pipe")
                output.data.pipe(save)
                console.log("Piping")
                save.on('finish', () => {
                    console.log("Done")
                    description = "description"
                    var process = child('python', ["./upload.py", url_save, username + ":" + password, title, description])
                    process.stdout.on('data', (data) => {
                        db.video_search(str, (video) => {
                            if (video == null) {
                                db.addVideo(str, title, description, account_id, data.toString(), (add)=>{
                                    if (add != null){
                                        fs.unlink(url_save, ()=>{
                                            res.render('uploadvideo', {error: "Success !"})
                                        })
                                        
                                    }
                                })
                            }
                            else{
                                db.updateVideo(str, title, description, account_id, data.toString(), (update)=>{
                                    if (update != null){
                                        fs.unlink(url_save, ()=>{
                                            res.render('uploadvideo', {error: "Success !"})
                                        })
                                        
                                    }
                                })
                            }
                        })
                    })
                })
                save.on('error', err => {
                    console.log(err)
                })
            })
            
        })
    })
})
server.listen(1212)