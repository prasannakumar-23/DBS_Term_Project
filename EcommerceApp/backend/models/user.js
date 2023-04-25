const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  name: {
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
    type:Number
  },
  phone_number: {
    type: String,
    required: true
  },
  gender: {
    type: String
  },
  account_ids: {
    type: [String]
  },
  default_id:{
    type: Number
  }
});

UserSchema.pre('save', function(next) {
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

UserSchema.methods.comparePassword = function(password, callback = () => {}) {
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


module.exports = mongoose.model('User', UserSchema);
