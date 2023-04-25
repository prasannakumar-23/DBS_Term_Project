const Sequelize = require('sequelize');
const mysql = require('mysql2');
const sequelize = new Sequelize('ecommerce', 'root', 'Prasanna@1234', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('MySQL connected'))
  .catch((err) => console.log(err));
const ProductCategory = sequelize.define('ProductCategory', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_name: Sequelize.STRING
});

const Product = sequelize.define('Product', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: Sequelize.INTEGER,
    references: {
      model: ProductCategory,
      key: 'id'
    }
  },
  name: Sequelize.STRING,
  description: Sequelize.STRING
});

const ProductItem = sequelize.define('ProductItem', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Product,
      key: 'id'
    }
  },
  email: Sequelize.STRING, // new field
  SKU: Sequelize.STRING,
  qty: Sequelize.INTEGER,
  price: Sequelize.FLOAT
});


const Variation = sequelize.define('Variation', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: Sequelize.INTEGER,
    references: {
      model: ProductCategory,
      key: 'id'
    }
  },
  name: Sequelize.STRING
});

const VariationOption = sequelize.define('VariationOption', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  variation_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Variation,
      key: 'id'
    }
  },
  value: Sequelize.STRING
});

const ProductConfig = sequelize.define('ProductConfig', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_item_id: {
    type: Sequelize.INTEGER,
    references: {
      model: ProductItem,
      key: 'id'
    }
  },
  variation_option_id: {
    type: Sequelize.INTEGER,
    references: {
      model: VariationOption,
      key: 'id'
    }
  }
});


ProductCategory.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(ProductCategory, { foreignKey: 'category_id' });

Product.hasMany(ProductItem, { foreignKey: 'product_id' });
ProductItem.belongsTo(Product, { foreignKey: 'product_id' });

ProductCategory.hasMany(Variation, { foreignKey: 'category_id' });
Variation.belongsTo(ProductCategory, { foreignKey: 'category_id' });

Variation.hasMany(VariationOption, { foreignKey: 'variation_id' });
VariationOption.belongsTo(Variation, { foreignKey: 'variation_id' });

ProductItem.hasMany(ProductConfig, { foreignKey: 'product_item_id' });
ProductConfig.belongsTo(ProductItem, { foreignKey: 'product_item_id' });

VariationOption.hasMany(ProductConfig, { foreignKey: 'variation_option_id' });
ProductConfig.belongsTo(VariationOption, { foreignKey: 'variation_option_id' });

sequelize.sync();



// Export ProductCategory model
module.exports = {
  ProductCategory,Product, ProductItem,Variation,VariationOption,ProductConfig
}

// Export Product model
// module.exports = {
//   Product
// }

// // Export ProductItem model
// module.exports = {
//   ProductItem
// }

// // Export Variation model
// module.exports = {
//   Variation
// }

// // Export VariationOption model
// module.exports = {
//   VariationOption
// }

// // Export ProductConfig model
// module.exports = {
//   ProductConfig
// }

/*

Now give me the server , route, controller code for an addToCart post request
flow:
To add a particular user product item to cart, check whether a row with that email and product item is present or not if present just increase the quantity and price, else add a new row.
*/