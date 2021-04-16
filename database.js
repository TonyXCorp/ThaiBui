const { Sequelize, Op, } = require('sequelize');

const sequelize = new Sequelize('thaibui', 'administrators', 'Root@123', {
  host: '103.151.52.169',
  port: 3306,
  dialect: "mysql",
  define: {
    freezeTableName: true,
    timestamps: false
  },
  dialectOptions: {
    ssl: false
  }
});
sequelize.authenticate()
sequelize.sync()
  .then(() => { console.log("Success !") })
  .catch((err) => { console.log(err) })
const videos = sequelize.define('videos', {
  drive_url: Sequelize.TEXT,
  title: Sequelize.TEXT,
  description: Sequelize.TEXT,
  insta_info_1: Sequelize.TEXT,
  insta_info_2: Sequelize.TEXT,
  insta_info_3: Sequelize.TEXT,
  status: Sequelize.TEXT,
  cache: Sequelize.TEXT,
})
const Administrator = sequelize.define('administrators',{
  password: Sequelize.TEXT
})
const insta_acccount = sequelize.define('insta_account', {
  username: Sequelize.TEXT,
  password: Sequelize.TEXT,
  count: Sequelize.INTEGER,
})
sequelize.sync()

function xuatAccRD(callback) {
  getAccounts(async data => {
    a1 = await Math.floor(Math.random() * data.length)
    while (a2 == a1) { a2 = await Math.floor(Math.random() * data.length) }
    while ((a3 == a2) || (a3 == a1)) { a3 = await Math.floor(Math.random() * data.length) }
    console.log("Choose: " + data[a1] + "|" + data[a2] + "|" + data[a3])
    callback(data[a1], data[a2], data[a3])
  })
}

function getVideos(callback) {
  videos.findAll({ raw: true }).then(task => {
    callback(task)
  })
}

function getAccounts(callback) {
  insta_acccount.findAll({ raw: true }).then(task => {
    callback(task)
  })
}

function count(callback) {
  videos.count().then(c => {
    insta_acccount.count().then(b => {
      callback(c, b)
    })
  })
}

function search(input, callback) {
  videos.findAll({
    raw: true,
    where: {
      [Op.or]: [
        { id: input },
        { drive_url: input },
        { title: input },
        { description: input },
        { insta_id: input },
        { insta_url: input },
        { status: input }
      ]
    }
  }).then(data => {
    callback(data)
  })
}
function getpass (callback) {
  Administrator.findOne({where:{id:'1'}})
  .then(row=>{
      callback(row.password)
  })
}
function changePASS (oldpass,newpass){
  Administrator.findOne({where:{id:'1'}})
  .then(row=>{
      if (row.password==oldpass) {
          Administrator.update({
          password:newpass
        },{where:{id:'1'}}
        )
      }
  })
}
function addAccount(input, callback) {
  username = input.split(":")[0]
  password = input.split(":")[1]
  insta_acccount.create({
    username: username,
    password: password,
    status: "LIVE"
  }).then(row => {
    callback = 'ok'
  }).catch(err => {
    callback = 'err'
  })
}

function delAccount(id) {
  insta_acccount.destroy({ where: { id: id } })
}


function addVideo(drive_url, insta_info_1, insta_info_2, insta_info_3, callback) {
  videos.create({
    drive_url: drive_url,
    insta_info_1,
    insta_info_2,
    insta_info_3,
    status: "Complete"
  }).then(row => {
    console.log(row)
    callback("Done")
  }).catch(err => {
    console.log(err)
    callback(null)
  })
}

function delVideo(id) {
  videos.destroy({ where: { id: id } })
}

function updateVideo(url, title, description, insta_info_1, insta_info_2, insta_info_3, callback) {
  videos.update({
    title: title,
    description: description,
    insta_info_1: insta_info_1,
    insta_info_2: insta_info_2,
    insta_info_3: insta_info_3,
    status: "Completed"
  }, {
    where: { drive_url: url },
  }).then(() => {
    callback("Done")
  }).catch((err) => {
    callback(null)
  })
}
function account_search(id, callback) {
  insta_acccount.findOne({
    where: { id: id },
    raw: true
  }).then(row => {
    callback(row["username"], row["password"])
  })
}
function account_check(input) {
  insta_acccount.findOne({
    where: { username: input.split(":")[0] },
    raw: true
  }).then(row => {
    if (row == null) { addAccount(input) }
  })
}
function link_check(input, callback) {
  videos.findOne({
    where: { drive_url: input },
    raw: true
  }).then(row => {
    if (row == null) { callback(true) } else callback(false)
  })
}
function video_search(url, callback) {
  videos.findOne({
    where: { drive_url: url },
    raw: true
  }).then(row => {
    callback(row)
  })
}
function video_search_by_id(id, callback) {
  videos.findOne({
    where: { id: id },
    raw: true
  }).then(row => {
    callback(row)
  })
}

function add_cache(id, link) {
  videos.update({
    cache: link
  }, {
    where: { id: id }
  })
}

function video_search_by_status(status, callback) {
  videos.findAll({
    where: { status: status },
    raw: true
  }).then(row => {
    callback(row)
  })
}
// Administrator.create({
//   password: '1'
// })
Administrator.findAll({}).then(row=>console.log(row))

function insta_add_1(video_url, info) {
  videos.update({
    insta_info_1: info
  },
    {
      where: { drive_url: video_url }
    })
}
function insta_add_2(video_url, info) {
  videos.update({
    insta_info_2: info
  },
    {
      where: { drive_url: video_url }
    })
}
function insta_add_3(video_url, info) {
  videos.update({
    insta_info_3: info
  },
    {
      where: { drive_url: video_url }
    })
}
function update_account(username) {
  insta_acccount.findOne({
    where: { username: username },
    raw: true
  }).then((row) => {
    amount = row["status"] + 1
    insta_acccount.update({
      status: amount
    }, {
      where: { username: username }
    })
  })
}
module.exports = {
  count: count,
  getVideos: getVideos,
  getAccounts: getAccounts,
  search: search,
  addAccount: addAccount,
  addVideo: addVideo,
  updateVideo: updateVideo,
  account_search: account_search,
  video_search: video_search,
  video_search_by_id: video_search_by_id,
  add_cache: add_cache,
  update: videos.update,
  video_search_by_status: video_search_by_status,
  account_check: account_check,
  delVideo: delVideo,
  delAccount: delAccount,
  insta_add_1: insta_add_1,
  insta_add_2: insta_add_2,
  insta_add_3: insta_add_3,
  link_check: link_check,
  getAccRD: xuatAccRD,
  update_account: update_account,
  changePASS:changePASS,
  getpass:getpass,
}