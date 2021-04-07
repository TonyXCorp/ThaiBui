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
  })
}
module.exports = {
  count: count,
  getVideos: getVideos,
  getAccounts: getAccounts
}