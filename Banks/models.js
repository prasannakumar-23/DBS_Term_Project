// BankInfo Model
const Sequelize = require('sequelize');
const sequelize = new Sequelize('banks', 'root', 'Prasanna@1234', {
  host: 'localhost',
  dialect: 'mysql'
});

const BankInfo = sequelize.define('bank_info', {
  bank_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bank_name: Sequelize.STRING,
  bank_branch: Sequelize.STRING,
  bank_location: Sequelize.STRING,
  bank_contact_info: Sequelize.STRING,
  createdAt: {
  type: Sequelize.DATE,
  defaultValue: Sequelize.NOW
},
updatedAt: {
  type: Sequelize.DATE,
  allowNull: false,
  defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
}
});

// Account Model
const Account = sequelize.define('account', {
    
  account_number: {primaryKey: true,type:Sequelize.STRING},
  account_holder_name: Sequelize.STRING,
  account_type: Sequelize.STRING,
  account_balance: Sequelize.FLOAT,
  username: Sequelize.STRING, // new field
  password: Sequelize.STRING, // new field
  bank_id: {
    type: Sequelize.INTEGER,
    references: {
      model: BankInfo,
      key: 'bank_id'
    }
  },
  createdAt: {
  type: Sequelize.DATE,
  defaultValue: Sequelize.NOW
},updatedAt: {
  type: Sequelize.DATE,
  allowNull: false,
  defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
}
});

// Define association between BankInfo and Account
BankInfo.hasMany(Account, { foreignKey: 'bank_id' });
Account.belongsTo(BankInfo, { foreignKey: 'bank_id' });

console.log(BankInfo)

// Synchronize models with database
sequelize.sync();


module.exports = {
  BankInfo,
  Account
};