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
.then(()=>{ console.log("Success !")})
.catch((err)=>{ console.log(err)})
const videos = sequelize.define('videos', {
  drive_url: Sequelize.TEXT,
  title: Sequelize.TEXT,
  description: Sequelize.TEXT,
  insta_id: Sequelize.INTEGER,
  insta_url: Sequelize.TEXT,
  status: Sequelize.TEXT,
})
const insta_acccount = sequelize.define('insta_account', {
  username: Sequelize.TEXT,
  password: Sequelize.TEXT,
  status: Sequelize.TEXT,
})
sequelize.sync()

function getVideos(callback){
  videos.findAll({raw:true}).then(task=>{
    callback(task)
  })
}

function getAccounts(callback){
  insta_acccount.findAll({raw:true}).then(task=>{
    callback(task)
  })
}

function count(callback){
    videos.count().then(c=>{
      insta_acccount.count().then(b=>{
        callback(c, b)
      })
    })
}

function search(input, callback){
  videos.findAll({
    raw: true,
    where: {
      [Op.or]: [
        {id: input},
        {drive_url: input},
        {title: input},
        {description: input},
        {insta_id: input},
        {insta_url: input},
        {status: input}
      ]
    }
  }).then(data=>{
    callback(data)
  })
}

function addAccount(input){
  username = input.split(":")[0]
  password = input.split(":")[1]
  insta_acccount.create({
    username: username,
    password: password,
    status: "LIVE"
  }).then(row=>{
    console.log(row)
  }).catch(err=>{
    console.log(err)
  })
}

function addVideo(drive_url, title, description, insta_id, insta_url, callback){
  videos.create({
    drive_url: drive_url,
    title: title,
    description: description,
    insta_id: insta_id,
    insta_url: insta_url,
    status: "Complete"
  }).then(row=>{
    console.log(row)
    callback("Done")
  }).catch(err=>{
    console.log(err)
    callback(null)
  })
}

function updateVideo(url, title, description, insta_id, insta_url, callback) {
  videos.update({
    title: title,
    description: description,
    insta_id: insta_id,
    insta_url: insta_url, 
    status: "Completed"
  }, {
    where: {drive_url: url},
  }).then(()=>{
    callback("Done")
  }).catch((err)=>{
    callback(null)
  })
}
function account_search(id, callback) {
  insta_acccount.findOne({
    where: {id: id},
    raw: true
  }).then(row=>{
    callback(row["username"], row["password"])
  })
}
function video_search(url, callback) {
  videos.findOne({
    where: {drive_url: url},
    raw: true
  }).then(row=>{
    callback(row)
  })
}
function video_search_by_id(id, callback) {
  videos.findOne({
    where: {id: id},
    raw: true
  }).then(row=>{
    callback(row)
  })
}
// insta_acccount.create({
//   username: "an8amc1234",
//   password: "tonyparker2003",
//   status: "LIVE"
// })
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
  video_search_by_id: video_search_by_id
}