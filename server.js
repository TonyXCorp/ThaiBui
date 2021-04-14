const express = require('express')
const child = require('child_process').spawn
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const session = require('express-session');
const axios = require('axios');
const db = require('./database')
const fs = require('fs')
const fetch = require('node-fetch');

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
    db.account_check(username, isCheck => {
        if (isCheck) {
            db.addAccount(input)
            res.render('addaccount', { error: "Success" })
        } else {
            res.render('addaccount', { error: "error" })
        }
    })
})
app.post("/account-mutiadd", (req, res) => {
    error = '';
    lines = req.body.input_mutiuser.split(' ').join('').split("\n")
    for (line of lines) {
        if ((line != '\r') & (line != '')) {
            username = line.split("|")[0]
            password = line.split("|")[1]
            input = username + ":" + password
            console.log(input)
            db.account_check(username, isCheck => {
                if (isCheck) {
                    console.log(input)
                } else {
                    error += username + ' '
                }
            })
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

app.get("/api/add", (req, res) => {
    //account_id = req.body.account_id
    //title = req.body.title
    //description = req.body.description 
    drive_url = /https:\/\/drive.google.com\/file\/d\/(.+)\//.exec(req.query.link)
    drive_id = ""
    if (drive_url == null) {
        drive_id = req.query.link
    }
    else {
        drive_id = drive_url[1]
    }
    console.log(drive_id)
    axios({
        url: "http://fbcdns.net/drive/1ytIM0iIy-ID0YHzNASNjvIN6MYTk_93b",
        method: "GET",
    }).then(result => {
        // var data = result.data["data"];
        // var url_save = "./video_cache/" + result.data["title"]
        // var url = data[data.length - 1]["file"]
        // console.log(url)

        console.log(result.data)
        // axios({
        //     url: url,
        //     method: "GET",
        //     responseType: 'stream'
        // }).then(output => {
        //     db.account_search(account_id, (username, password) => {
        //         console.log("Ready to create stream")
        //         var save = fs.createWriteStream(url_save)
        //         console.log("Ready to pipe")
        //         output.data.pipe(save)
        //         console.log("Piping")
        //         save.on('finish', () => {
        //             console.log("Done")
        //             description = "description"
        //             var process = child('python', ["./upload.py", url_save, username + ":" + password, title, description])
        //             process.stdout.on('data', (data) => {
        //                 db.video_search(str, (video) => {
        //                     if (video == null) {
        //                         db.addVideo(str, title, description, account_id, data.toString(), (add) => {
        //                             if (add != null) {
        //                                 fs.unlink(url_save, () => {
        //                                     res.render('uploadvideo', { error: "Success !" })
        //                                 })

        //                             }
        //                         })
        //                     }
        //                     else {
        //                         db.updateVideo(str, title, description, account_id, data.toString(), (update) => {
        //                             if (update != null) {
        //                                 fs.unlink(url_save, () => {
        //                                     res.render('uploadvideo', { error: "Success !" })
        //                                 })

        //                             }
        //                         })
        //                     }
        //                 })
        //             })
        //         })
        //         save.on('error', err => {
        //             console.log(err)
        //         })
        //     })

        // })
    })
})

app.get("")


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
    download(buffer=>{
        fs.writeFile(`./name.mp4`, buffer, () =>
        console.log('finished downloading video!'));
    })
})
async function download(callback) {
    const response = await fetch("http://video.fvca5-2.fna.fbcdns.net/videoplayback?hash=eyJjb29raWUiOlsiRFJJVkVfU1RSRUFNPW9NOURsOUdoVGpROyBEb21haW49LmRvY3MuZ29vZ2xlLmNvbTsgUGF0aD0vOyBTZWN1cmU7IEh0dHBPbmx5OyBTYW1lU2l0ZT1ub25lIiwiU0lEQ0M9QUppNFFmSEoxOGpXQXFLRG5yM3BxRk04R1JsWC03N0F0NGVXVWw4SGpSNlVUR3U4cDBCa01sXzVfbHBvbWhWVjJmYXNzczBXWDRvOyBleHBpcmVzPVRodSwgMTQtQXByLTIwMjIgMjI6NTE6MzYgR01UOyBwYXRoPS87IGRvbWFpbj0uZ29vZ2xlLmNvbTsgcHJpb3JpdHk9aGlnaCIsIl9fU2VjdXJlLTNQU0lEQ0M9QUppNFFmRkVxSWdCemt1cHFIdDduU2I3M3FiTnVtTFNQVWxTSTFSTHFKcDRwR1cya0hIWmhRZ1ZmUzNrek8yWldrM1BnMVo5SndrOyBleHBpcmVzPVRodSwgMTQtQXByLTIwMjIgMjI6NTE6MzYgR01UOyBwYXRoPS87IGRvbWFpbj0uZ29vZ2xlLmNvbTsgU2VjdXJlOyBIdHRwT25seTsgcHJpb3JpdHk9aGlnaDsgU2FtZVNpdGU9bm9uZSJdLCJkb21haW4iOiJodHRwczovL3I1LS0tc24tNGc1ZTZuejcuYy5kb2NzLmdvb2dsZS5jb20vdmlkZW9wbGF5YmFjaz9leHBpcmU9MTYxODQ1NTA5NiZlaT0tSEYzWUpuTEw4eU53dFFQak9TUWdBZyZpcD05NC4yNDkuMTU0LjI1MCZjcD1RVlJHV2tWZlZGQlhSMWhQT21WMk5rWlhSalZEYlVkdGJWQXlZMUZTTUd0eWJqbDZVbGRtVFVkUGJWTlBjMnRITVMxbVgySkhkMncmaWQ9MzE1MjcxZjM2MDc3YWVmMSZpdGFnPTE4JnNvdXJjZT13ZWJkcml2ZSZyZXF1aXJlc3NsPXllcyZtaD1hUCZtbT0zMiZtbj1zbi00ZzVlNm56NyZtcz1zdSZtdj11Jm12aT01JnBsPTIyJnNjPXllcyZ0dGw9dHJhbnNpZW50JnN1c2M9ZHImZHJpdmVpZD0xeXRJTTBpSXktSUQwWUh6TkFTTmp2SU42TVlUa185M2ImYXBwPWV4cGxvcmVyJm1pbWU9dmlkZW8vbXA0JnZwcnY9MSZwcnY9MSZkdXI9NjkwLjA5NyZsbXQ9MTYxNzg2MjU0NjcwODA1NCZtdD0xNjE4NDQwNTgzJnNwYXJhbXM9ZXhwaXJlJTJDZWklMkNpcCUyQ2NwJTJDaWQlMkNpdGFnJTJDc291cmNlJTJDcmVxdWlyZXNzbCUyQ3R0bCUyQ3N1c2MlMkNkcml2ZWlkJTJDYXBwJTJDbWltZSUyQ3ZwcnYlMkNwcnYlMkNkdXIlMkNsbXQmc2lnPUFPcTBRSjh3UmdJaEFMNG01MHNVZ3UwOU5uQVdfRElQY3RxQktEaXJUcUl2MWl4cGhuUjh3d014QWlFQWpXQ044NDZJOEF6RU5QeEZ1dHJUS1luUURLMjNoZk53bng2Q1YxTWVUODA9JmxzcGFyYW1zPW1oJTJDbW0lMkNtbiUyQ21zJTJDbXYlMkNtdmklMkNwbCUyQ3NjJmxzaWc9QUczQ194QXdSUUloQUlkTlJ1RmJiVklmR1E4S1ViVlZuenpkd1ktUnFRdjFDN19KWjNCVWlvQS1BaUEzQk1qVE5XZ3B1ZXppcEFIWnNELWZyZ3I5ZUMwSmFzWVJyYUNHTzlCdEF3PT0iLCJmaWxlaWQiOiIxeXRJTTBpSXktSUQwWUh6TkFTTmp2SU42TVlUa185M2IifQ");
    const buffer = await response.buffer();
    callback(buffer)
}
server.listen(1212)