const { Sequelize, } = require('sequelize');

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
getData(data=>{
  console.log(data)
})
sequelize.sync()

function getData(callback){
  videos.findAll({raw:true}).then(task=>{
    callback(task)
  })
}
