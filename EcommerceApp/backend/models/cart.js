const Sequelize = require('sequelize');
const mysql = require('mysql2');
const {ProductItem} = require('./product');

console.log("PRODUCT ITEM",ProductItem)
const sequelize = new Sequelize('ecommerce', 'root', 'Prasanna@1234', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('MySQL connected'))
  .catch((err) => console.log(err));

const Cart = sequelize.define('Cart', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  product_item_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: ProductItem,
      key: 'id'
    }
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false
  }
}, {
  primaryKey: ['email', 'product_item_id']
});

sequelize.sync()
  .then(() => {
    console.log('Cart table has been created');
  })
  .catch((err) => {
    console.error('Unable to create cart table:', err);
  });

ProductItem.hasMany(Cart, { foreignKey: 'product_item_id' });
Cart.belongsTo(ProductItem, { foreignKey: 'product_item_id' });

module.exports = Cart;
