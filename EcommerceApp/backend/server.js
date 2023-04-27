const express = require('express');
const Sequelize = require('sequelize');
const mongoose = require('mongoose');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const {Order, OrderProduct, OrderWarehouse, OrderVerdictUnclear, OrderVerdictClear }=require('./models/order.js')
// const mongodbRoutes = require('./routes/mongodb/user');
// const mysqlRoutes = require('./routes/mysql/user');

// Connect to MongoDB
mongoose.connect('mongodb+srv://tirutsavatest:testtirutsava@cluster0.jyhpmxn.mongodb.net/ecommerce?retryWrites=true&w=majority', { useNewUrlParser: true,
    useUnifiedTopology: true})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Connect to MySQL
const sequelize = new Sequelize('ecommerce', 'root', 'Prasanna@1234', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('MySQL connected'))
  .catch((err) => console.log(err));

// Create express app
const app = express();
app.use(cors());


// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(passport.initialize());


// MongoDB routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/sellers', require('./routes/sellerRoutes'));
// MySQL routes
// app.use('/api/mysql/users', mysqlRoutes);
app.use('/api/product',require('./routes/productRoutes'))
app.use('/api/cart',require('./routes/cartRoutes'))
app.use('/api/order',require('./routes/orderRoutes'))
app.use('/api/warehouse',require('./routes/warehouseRoutes'))



function updateOrders() {
  now=new Date()
  OrderVerdictUnclear.findAll({
    where: {
      status_id: 'TBD',
      date: {
        [Sequelize.Op.lt]: new Date(now.getTime()+(7 * 24 * 60 * 60 * 1000))
      }
    }
  }).then((orders) => {
    orders.forEach((order) => {
      order.update({
        status_id: 'HOL'
      });
    });
  });
}

setInterval(updateOrders, 5000);



function updateReturnOrders() {
  now=new Date()
  OrderVerdictUnclear.findAll({
    where: {
      status_id: 'RTBD',
      date: {
        [Sequelize.Op.lt]: new Date(now.getTime())
      }
    }
  }).then((orders) => {
    orders.forEach((order) => {
      order.update({
        status_id: 'RHOL'
      });
    });
  });
}
// Start server
setInterval(updateReturnOrders, 5000);

const port = process.env.PORT || 8800;
app.listen(port, () => console.log(`Server running on port ${port}`));

