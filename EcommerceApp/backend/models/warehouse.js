const Sequelize = require('sequelize');
const mysql = require('mysql2');
const sequelize = new Sequelize('ecommerce', 'root', 'Prasanna@1234', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('MySQL connected'))
  .catch((err) => console.log(err));

const Warehouse = sequelize.define('Warehouse', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

sequelize.sync()
  .then(() => {
    console.log('Order tables have been created');
  })
  .catch((err) => {
    console.error('Unable to create order tables:', err);
  });
module.exports = Warehouse;
