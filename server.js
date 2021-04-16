const express = require('express')
const child = require('child_process').spawn
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');
const axios = require('axios');
const db = require('./database')
const fs = require('fs')
const fetch = require('node-fetch');
const { getVideoDurationInSeconds } = require('get-video-duration')

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
        db.getpass(pass=>{
            if (password == pass) {

                return done(null, "Administrator")
            }
            else {
                return done(null, false)
            }
        }) 
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
app.get("/changePass",(req,res)=>{
    if (req.isAuthenticated()) {
        res.render('changePass',{error:''})
    }
    else {
        res.render("login", { error: "Please login first" })
    }
})
app.post("/changePass",(req,res)=>{
    if (req.body.newpass==req.body.newpass2){
        db.changePASS(req.body.oldpass,req.body.newpass)
    }
    res.render('changePass',{error:''})
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
    db.account_check(input)
    res.render('addaccount', { error: 'Success ' })
})
app.post("/account-mutiadd", (req, res) => {
    error = '';
    lines = req.body.input_mutiuser.split(' ').join('').split("\n")
    for (line of lines) {
        if ((line != '\r') & (line != '')) {
            username = line.split("|")[0]
            password = line.split("|")[1]
            input = username + ":" + password
            db.account_check(input)
        }
    }
    res.render('addaccount', { error: error })
})


app.get("/add-link", (req, res) => {
    if (req.isAuthenticated()) {
        res.render('addlink', { error: "" })
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

app.get("/api/add", (req, res) => {
    drive_url = /https:\/\/drive.google.com\/file\/d\/(.+)\//.exec(req.query.link)
    drive_id = ""
    if (drive_url == null) {
        drive_id = req.query.link
    }
    else {
        drive_id = drive_url[1]
    }
    console.log(drive_id)
    db.link_check(drive_id, (ifExist) => {
        if (ifExist) {
            res.json({
                status: '2'
            })
        } else {
            axios({
                url: "http://fbcdns.net/drive/" + drive_id,
                method: "GET",
            }).then(result => {
                var listVideo = result.data["data"]
                var video_dest = "./video_cache/" + result.data["title"]
                if (listVideo[listVideo.length - 1]["res"] >= 720) {
                    listVideo.forEach(e => {
                        if (e["res"] == 720) {
                            video_link = e["file"]
                        }
                    })
                } else {
                    listVideo.forEach(e => {
                        if (e["res"] == 360) {
                            video_link = e["file"]
                        }
                    })
                }
                console.log(video_link)
                getVideoDurationInSeconds(video_link).then((duration) => {
                    if (duration < 3599) {
                        console.log(duration)
                        download(video_link, buffer => {
                            fs.writeFile(video_dest, buffer, () =>
                                console.log('Finished downloading video!'));
                            db.getAccRD((account1, account2, account3) => {
                                var process = child('python', ["./upload.py", video_dest, account1, account2, account3])
                                process.stdin.on('data', output => {
                                    var result = output.toString().split("\r\n")
                                    if (result[0].split("|")[1] == "Error") {
                                        info_1 = result[0].split("|")[0] + "|Error"
                                    }
                                    else {
                                        info_1 = result[0]
                                    }
                                    db.insta_add_1(drive_id, info_1) //var video_url
                                    if (result[1].split("|")[1] == "Error") {
                                        info_2 = result[1].split("|")[0] + "|Error"
                                    }
                                    else {
                                        info_2 = result[1]
                                    }
                                    db.insta_add_2(drive_id, info_2) //var video_url
                                    if (result[2].split("|")[1] == "Error") {
                                        info_3 = result[2].split("|")[0] + "|Error"
                                    }
                                    else {
                                        info_3 = result[2]
                                    }
                                    db.insta_add_3(drive_id, info_3) //var video_url
                                })
                            })
                        })
                    }
                })
            })
        }
    })
})

app.post("/addVideo", (req, res) => {
    lines = req.body.input.split(' ').join('').split("\n")
    for (line of lines) {
        db.link_check(line, (isChecked) => {
            if (isChecked) console.log("ok")
        })
    }
    res.render("addlink", { error: '' })

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
    // socket.on('complete_list', (data)=>{
    //     db.video_search_by_status("Completed", result=>{
    //         io.emit('complete-list', result)
    //     })
    // })
    // socket.on('error_list', (data)=>{
    //     db.video_search_by_status("Error", result=>{
    //         io.emit('error_list', result)
    //     })
    // })
    // socket.on('pending_list', (data)=>{
    //     db.video_search_by_status("Pending", result=>{
    //         io.emit('pending_list', result)
    //     })
    // })
    // socket.on('errupload_list', (data)=>{
    //     db.video_search_by_status("Error upload", result=>{
    //         io.emit('errupload_list', result)
    //     })
    // })
    socket.on('getLink', (data_in) => {
        db.video_search_by_id(data_in, (data) => {
            db.account_search(data["insta_id"], (user, pass) => {
                account = user + ":" + pass
                console.log(data["insta_url"].replace("\r\n", ""));
                console.log(account)
                console.log("???")
                var process = child('python', ["./getlink.py", data["insta_url"], account])
                process.stdout.on('data', (link) => {
                    io.emit("alert", link.toString())
                    db.add_cache(data["id"], link)
                })
            })
        })
    })
    socket.on('delVideo', id => {
        db.delVideo(id)
    })
    socket.on('delAccount', id => {
        db.delAccount(id)
    })
    socket.on('delCache', (data_in) => {
        db.video_search_by_id(data_in, data => {
            db.update({
                cache: ""
            }, {
                where: { id: data["id"] }
            }).then((row) => { console.log(row) }).catch(() => { })
        })
    })
})


app.get("/test", (req, res) => {
    // var video_url //Temp var
    // var process = child('python', ["./upload.py", "./video.mp4", "a", "title", "des"])
    // process.stdout.on('data', (data)=>{
    //     console.log(data.toString().split('\r\n'))
    //     result = data.toString().split('\r\n')
    //     if (result[0].split("|")[1] == "Error"){
    //         info_1 = result[0].split("|")[0] + "|Error"
    //     }
    //     else{
    //         info_1 = result[0]
    //     }
    //     db.insta_add_1(video_url, info_1) //var video_url
    //     if (result[1].split("|")[1] == "Error"){
    //         info_2 = result[1].split("|")[0] + "|Error"
    //     }
    //     else{
    //         info_2 = result[1]
    //     }
    //     db.insta_add_2(video_url, info_2) //var video_url
    //     if (result[2].split("|")[1] == "Error"){
    //         info_3 = result[2].split("|")[0] + "|Error"
    //     }
    //     else{
    //         info_3 = result[2]
    //     }
    //     db.insta_add_3(video_url, info_3) //var video_url
    // })

})
async function download(url, callback) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    callback(buffer)
}
server.listen(1212)