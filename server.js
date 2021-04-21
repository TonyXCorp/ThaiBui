const express = require('express')
require('timers')
const child = require('child_process').spawn
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');
const axios = require('axios');
const db = require('./database')
const fs = require('fs')
const fetch = require('node-fetch');
const { getVideoDurationInSeconds } = require('get-video-duration')

const exec = require('child_process').exec

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
        db.getpass(pass => {
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
app.get("/changePass", (req, res) => {
    if (req.isAuthenticated()) {
        res.render('changePass', { error: '' })
    }
    else {
        res.render("login", { error: "Please login first" })
    }
})
app.post("/changePass", (req, res) => {
    if (req.body.newpass == req.body.newpass2) {
        db.changePASS(req.body.oldpass, req.body.newpass)
    }
    res.render('changePass', { error: '' })
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
        if (!ifExist) {
            res.json({
                status: '2'
            })
        } else {
            console.log("Else")
            axios({
                url: "http://fbcdns.net/drive/" + drive_id,
                method: "GET",
            }).then(result => {
                var listVideo = result.data["data"]
                var video_dest = "./video_cache/" + result.data["title"]
                console.log(video_dest)
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
                
                        id = "https://drive.google.com/uc?id=" + drive_id
                        const process = exec('cd video_cache && gdown ' + id)
                        process.on("exit", (code) => {
                            db.getAccRD(3, (acc1, acc2, acc3) => {
                                account1 = acc1["username"] + ":" + acc1["password"]
                                account2 = acc2["username"] + ":" + acc2["password"]
                                account3 = acc3["username"] + ":" + acc3["password"]
                                db.addVideo(id,acc1["username"],acc2["username"],acc3["username"],'Pending')
                                console.log(account1)
                                console.log(account2)
                                console.log(account3)
                                var process = child('python', ["./upload.py", video_dest, account1, account2, account3])
                                process.stdout.on('data', output => {
                                    var result = output.toString().split("\r\n")
                                    if (result[0].split("|")[1] == "Error") {
                                        info_1 = result[0].split("|")[0] + "|Error"
                                    }
                                    else {
                                        info_1 = result[0]
                                        db.update_account(result[0].split("|")[0])
                                    }
                                    if (result[1].split("|")[1] == "Error") {
                                        info_2 = result[1].split("|")[0] + "|Error"
                                    }
                                    else {
                                        info_2 = result[1]
                                        db.update_account(result[1].split("|")[0])
                                    }
                                    if (result[2].split("|")[1] == "Error") {
                                        info_3 = result[2].split("|")[0] + "|Error"
                                    }
                                    else {
                                        info_3 = result[2]
                                        db.update_account(result[2].split("|")[0])
                                    }
                                    db.updateVideo(drive_id, info_1, info_2, info_3,() => {
                                        // fs.unlink(video_dest, (err) => { console.log(err) })
                                        res.json({
                                            account1: info_1,
                                            account2: info_2,
                                            account3: info_3
                                        })
                                    })
                                })
                            })
                        })    
                    }else {
                        res.json({status:'0'})
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
            if (isChecked) {
                axios.get('https://localhost:1212/api/add', { params: { link: line } })
            }
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
    socket.on('complete_list', (data)=>{
        db.video_search_by_status("Completed", result=>{
            io.emit('complete-list', result)
        })
    })
    socket.on('error_list', (data)=>{
        db.video_search_by_status("Error", result=>{
            io.emit('error_list', result)
        })
    })
    socket.on('pending_list', (data)=>{
        db.video_search_by_status("Pending", result=>{
            io.emit('pending_list', result)
        })
    })
    socket.on('errupload_list', (data)=>{
        db.video_search_by_status("Error upload", result=>{
            io.emit('errupload_list', result)
        })
    })
    socket.on('getLink', (data_in) => {
        getmp4(data_in, (amount) =>{
            io.emit('alert', amount.split("|")[0])
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

async function download(url, callback) {
    id = "https://drive.google.com/uc?id=" + url
    const process = exec('cd video_cache && gdown ' + id)
    process.on("exit", (code) => {
    })
}

app.get("/api/json/getmp4", (req, res)=>{
    data_in = req.query.link
    getmp4(data_in, amount=>{
        res.json({
            status: 1,
            id: data_in,
            account: amount.split("|")[2],
            linkmp4: amount.split("|")[0]
        })
    })
})


async function getmp4(data_in, callback){
    db.video_search_by_url(data_in, (data) => {
        user1 = data["insta_info_1"].split("|")[0]
        user2 = data["insta_info_2"].split("|")[0]
        user3 = data["insta_info_3"].split("|")[0]
        db.getPassword(user1, user2, user3, (acc1, acc2, acc3) => {
            data1 = acc1.replace("\r", "") + "|" + data["insta_info_1"].split("|")[1]
            data2 = acc2.replace("\r", "") + "|" + data["insta_info_2"].split("|")[1]
            data3 = acc3.replace("\r", "") + "|" + data["insta_info_3"].split("|")[1]
            var process = child("python", ["./getlink.py", data1, data2, data3])
            process.stdout.on('data', count => {
                amount = count.toString()
                num = amount.split("|")[1]
                if (num != "0") {
                    axios({
                        url: "http://fbcdns.net/drive/" + data_in,
                        method: 'GET'
                    }).then(result => {
                        var listVideo = result.data["data"]
                        var video_dest = "./video_cache" + result.data["title"]
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
                        download(video_link, () => {
                            if (num == "1") {
                                db.getAccRD(1, (acc) => {
                                    account1 = acc["username"] + ":" + acc["password"]
                                    var process = child('python', ["./upload.py", video_dest, account1, "null", "null"])
                                    process.stdout.on('data', output => {
                                        var result = output.toString()
                                        if (result.split("|")[1] != "Error") {
                                            info_1 = result.split("|")[0]
                                            db.update_account(result.split("|")[0])
                                            db.insta_add_1(data_in, info_1)
                                        } else {
                                            info_1 = result.split("|")[0] + "|Error"
                                        }
                                    })
                                })
                            }

                            if (num == "2") {
                                db.getAccRD(2, (acc1, acc2) => {
                                    account1 = acc1["username"] + ":" + acc1["password"]
                                    account2 = acc2["username"] + ":" + acc2["password"]
                                    var process = child('python', ["./upload.py", video_dest, account1, account2, "null"])
                                    process.stdout.on('data', output => {
                                        var result = output.toString().replace("\r\n")
                                        if (result[0].split("|")[1] != "Error") {
                                            info_1 = result.split("|")[0]
                                            db.update_account(result.split("|")[0])

                                        } else {
                                            info_1 = result.split("|")[0] + "|Error"
                                        }
                                        db.insta_add_1(data_in, info_1)
                                        if (result[1].split("|")[1] != "Error") {
                                            info_2 = result.split("|")[0]
                                            db.update_account(result.split("|")[0])
                                            db.insta_add_2(data_in, info_2)
                                        } else {
                                            info_2 = result.split("|")[0] + "|Error"
                                        }
                                        db.insta_add_2(data_in, info_2)
                                    })
                                })
                            }

                            if (num == "3") {
                                db.getAccRD(3, (acc1, acc2, acc3) => {
                                    account1 = acc1["username"] + ":" + acc1["password"]
                                    account2 = acc2["username"] + ":" + acc2["password"]
                                    account3 = acc3["username"] + ":" + acc3["password"]
                                    var process = child('python', ["./upload.py", video_dest, account1, account2, account3])
                                    process.stdout.on('data', output => {
                                        var result = output.toString().replace("\r\n")
                                        if (result[0].split("|")[1] != "Error") {
                                            info_1 = result.split("|")[0]
                                            db.update_account(result.split("|")[0])

                                        } else {
                                            info_1 = result.split("|")[0] + "|Error"
                                        }
                                        db.insta_add_1(data_in, info_1)
                                        if (result[1].split("|")[1] != "Error") {
                                            info_2 = result.split("|")[0]
                                            db.update_account(result.split("|")[0])
                                            db.insta_add_2(data_in, info_2)
                                        } else {
                                            info_2 = result.split("|")[0] + "|Error"
                                        }
                                        db.insta_add_2(data_in, info_2)
                                        if (result[2].split("|")[1] != "Error") {
                                            info_3 = result.split("|")[0]
                                            db.update_account(result.split("|")[0])
                                            db.insta_add_3(data_in, info_3)
                                        } else {
                                            info_3 = result.split("|")[0] + "|Error"
                                        }
                                        db.insta_add_3(data_in, info_3)
                                    })
                                })
                            }
                        })
                    })
                }
                db.add_cache(data_in, amount.split("|")[0])
                callback(amount)
            })
        })

    })
}

async function automatic() {
    setInterval(() => {
        console.log("1gio")
    }, 3600000)
}
automatic()
server.listen(1212)