const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const SellerSchema = new Schema({
  company_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  address: {
    type: [String],
    required: true
  },
  default_address:{
    type:Number,
    required:true
  },
  phone_number: {
    type: String,
    required: true
  },
  business_registration_number: {
    type: String,
    required: true,
    unique: true
  },
  account_ids: {
    type: [String]
  },
  default_id:{
    type:Number
  }
});

SellerSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) {
      return next(err);
    }
    
    this.password = passwordHash;
    next();
  });
});

SellerSchema.methods.comparePassword = function(password, callback = () => {}) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    console.log(password,this.password)
    console.log(isMatch)
    
    if (err) {
      console.log(password,this.password)
      return callback(err);
    }
    
    callback(null, isMatch);
  });
}

module.exports = mongoose.model('Seller', SellerSchema);
