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
videos.bulkCreate([
  {
    drive_url: "https://drive.google.com/file/d/11FwWeLuesj3IgkkocGIMZe4GxXLpL2Sh/view?usp=sharing",
    title: "Test 1 video",
    description: "This is a test video 1",
    insta_id: "1",
    insta_url: "instagram.com",
    status: "Completed"
  },
  {
    drive_url: "https://drive.google.com/file/d/11FwWeLuesj3IgkkocGIMZe4GxXLpL2Sh/view?usp=sharing",
    title: "Test 2 video",
    description: "This is a test video 2",
    insta_id: "2",
    insta_url: "instagram.com",
    status: "Completed"
  },
  {
    drive_url: "https://drive.google.com/file/d/11FwWeLuesj3IgkkocGIMZe4GxXLpL2Sh/view?usp=sharing",
    title: "Test 3 video",
    description: "This is a test video 3",
    insta_id: "3",
    insta_url: "instagram.com",
    status: "Incompleted"
  },
  {
    drive_url: "https://drive.google.com/file/d/11FwWeLuesj3IgkkocGIMZe4GxXLpL2Sh/view?usp=sharing",
    title: "Test 4 video",
    description: "This is a test video 4",
    insta_id: "4",
    insta_url: "instagram.com",
    status: "Completed"
  },
])
insta_acccount.bulkCreate([
  {
    username: "tonytony",
    password: "parkerparker",
    status: "LIVE"
  },
  {
    username: "testing1",
    password: "phamminh",
    status: "DEATH"
  },
  {
    username: "testing2",
    password: "helloworld",
    status: "LIVE"
  },
])
sequelize.sync()

