const Sequelize = require('sequelize');

const sequelize = new Sequelize('ecommerce', 'root', 'Prasanna@1234', {
host: 'localhost',
dialect: 'mysql'
});
const {ProductItem} = require('./product');
const Warehouse = require('./warehouse');

// Order_table1
const Order = sequelize.define('Order', {
order_id: {
type: Sequelize.INTEGER,
allowNull: false,
autoIncrement: true,
primaryKey: true
},
user_email: {
type: Sequelize.STRING,
allowNull: false
},
order_total: {
type: Sequelize.FLOAT,
allowNull: false
},
transaction_id: {
type: Sequelize.STRING,
allowNull: false
},
time_of_order: {
type: Sequelize.DATE,
allowNull: false,
defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
}
});

// Order_table2
const OrderProduct = sequelize.define('OrderProduct', {
op_id: {
type: Sequelize.INTEGER,
allowNull: false,
autoIncrement: true,
primaryKey: true
},
quantity: {
type: Sequelize.INTEGER,
allowNull: false
},
price: {
type: Sequelize.FLOAT,
allowNull: false
}
});

// Associations between Order tables and ProductItem table

OrderProduct.belongsTo(ProductItem, { foreignKey: 'product_item_id' });

// Order_table3
const OrderWarehouse = sequelize.define('OrderWarehouse', {
  ow_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  op_id: {
    type: Sequelize.INTEGER,
    references: {
      model: OrderProduct,
      key: 'op_id'
    }
  },
  warehouse_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Warehouse,
      key: 'id'
    }
  },
  arrival_date: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
});

// Associations between Order tables and Warehouse table

OrderWarehouse.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });

// Associations between Order tables
Order.hasMany(OrderProduct, { foreignKey: 'order_id' });
OrderProduct.belongsTo(Order, { foreignKey: 'order_id' });

OrderProduct.hasMany(OrderWarehouse, { foreignKey: 'op_id' });
OrderWarehouse.belongsTo(OrderProduct, { foreignKey: 'op_id' });

// Order_table4
const OrderVerdictUnclear = sequelize.define('OrderVerdictUnclear', {
ovu_id: {
type: Sequelize.INTEGER,
allowNull: false,
autoIncrement: true,
primaryKey: true
},
user_email: {
type: Sequelize.STRING,
allowNull: false
},
seller_email: {
type: Sequelize.STRING,
allowNull: false
},
otp: {
type: Sequelize.STRING,
allowNull: false
},
status_id: {
type: Sequelize.STRING,
allowNull: false,
validate: {
isIn: [['TBD', 'DEL', 'RRS', 'RA', 'HOL', 'DAR','RHOL','RTBD']]
}
},
date: {
type: Sequelize.DATE,
allowNull: false,
defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
}
});

// Associations between Order tables and OrderVerdictUnclear table


const OrderVerdictClear = sequelize.define('OrderVerdictClear', {
  ovc_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  status_id: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIn: [['DEL', 'RET', 'CAN', 'RDEL']]
    }
  }
});


OrderProduct.hasOne(OrderVerdictUnclear, { foreignKey: 'op_id' });
OrderVerdictUnclear.belongsTo(OrderProduct, { foreignKey: 'op_id' });

OrderProduct.hasOne(OrderVerdictClear, { foreignKey: 'op_id' });
OrderVerdictClear.belongsTo(OrderProduct, { foreignKey: 'op_id' });


sequelize.sync()
  .then(() => {
    console.log('Order tables have been created');
  })
  .catch((err) => {
    console.error('Unable to create order tables:', err);
  });



module.exports = { Order, OrderProduct, OrderWarehouse, OrderVerdictUnclear, OrderVerdictClear };





/*const Sequelize = require('sequelize');

const sequelize = new Sequelize('ecommerce', 'root', 'Prasanna@1234', {
  host: 'localhost',
  dialect: 'mysql'
});
const {ProductItem} = require('./product');
const Warehouse = require('./warehouse');
// Order_table1
const Order = sequelize.define('Order', {
  order_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  user_email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  order_total: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  transaction_id: {
    type: Sequelize.STRING,
    allowNull: false
  },
  time_of_order: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  }
});

// Order_table2
const OrderProduct = sequelize.define('OrderProduct', {
  op_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  delivery_date: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP + INTERVAL 7 DAY')
  }

});

// Associations between Order tables and ProductItem table



// Order_table3
const OrderWarehouse = sequelize.define('OrderWarehouse', {
  op_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: OrderProduct,
      key: 'op_id'
    }
  },
  warehouse_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    references: {
      model: Warehouse,
      key: 'id'
    }
  }
});

// Associations between Order tables and Warehouse table


OrderProduct.belongsTo(ProductItem, { foreignKey: 'product_item_id' });
OrderWarehouse.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });

// Associations between Order tables
Order.hasMany(OrderProduct, { foreignKey: 'order_id' });
OrderProduct.belongsTo(Order, { foreignKey: 'order_id' });

OrderProduct.hasMany(OrderWarehouse, { foreignKey: 'op_id' });
OrderWarehouse.belongsTo(OrderProduct, { foreignKey: 'op_id' });

sequelize.sync()
  .then(() => {
    console.log('Order tables have been created');
  })
  .catch((err) => {
    console.error('Unable to create order tables:', err);
  });

module.exports = { Order, OrderProduct, OrderWarehouse };
*/