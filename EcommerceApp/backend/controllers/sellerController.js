const bcrypt = require('bcrypt');
const User = require('../models/seller');

exports.register = async (req, res) => {
  const {
    company_name,
    email,
    password,
    address,
    default_address,
    phone_number,
    business_registration_number,
    account_ids,
    default_id
  } = req.body;

  try {
    
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: 'User with the same email already exists' });
    }

    // Create new user
    const newUser = new User({
    company_name,
    email,
    password,
    address,
    default_address,
    phone_number,
    business_registration_number,
    account_ids,
    default_id
    });
    await newUser.save();

    res.status(201).json({ message: 'Seller created successfully' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // Find user with the given email
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        console.log("In !user")
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Compare password and pass both user and isMatch values
      return user.comparePassword(password, (err, isMatch) => {
        console.log(isMatch)
        if (err) {
          return res.status(500).json({ message: err });
        }

        if (!isMatch) {
          console.log("In !isMatch")
          return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Store user id in local storage
        // localStorage.setItem('userId', user.email);

        return res.status(200).json({ message: 'Login successful' });
      });
    })
    .catch(err => {
      console.log(isMatch)
      return res.status(500).json({ message: err });
    });
}




exports.logout = (req, res) => {
  // Remove user id from local storage
  localStorage.removeItem('userId');

  res.status(200).json({ message: 'Logout successful' });
};