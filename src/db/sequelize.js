const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:Asap@100@localhost:5432/event',{
    define: {
        freezeTableName: true
      }, // This makes the tablename same as model name.
}) // Establishing a DB Connectoion using sequelize instance.
const checkConnection = async()=>{
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

checkConnection();

(async () => {
    await sequelize.sync();
  })();

module.exports = sequelize;