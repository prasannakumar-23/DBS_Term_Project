import React, { useState} from 'react';
import { } from 'react-router-dom';
import axios from 'axios';
import './sellerRegister.css';

const SellerRegister = () => {

  const [user, setUser] = useState({
    company_name: '',
    email: '',
    password: '',
    address: [],
    business_registration_number: '',
    default_address: null,
    phone_number: '',
    account_ids: [],
    default_id: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const { address } = user;

    address[Number(name)] = value;

    setUser((prevUser) => ({
      ...prevUser,
      address,
    }));
  };
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    const { account_ids } = user;

    account_ids[Number(name)] = value;

    setUser((prevUser) => ({
      ...prevUser,
      account_ids,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user)
    try {
      await axios.post('http://localhost:8800/api/sellers/register', user);
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>

        <label htmlFor="company_name">Company_Name:</label>
        <input
          type="text"
          name="company_name"
          value={user.company_name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone_number">Phone Number:</label>
        <input
          type="text"
          name="phone_number"
          value={user.phone_number}
          onChange={handleChange}
          required
        />

        <label htmlFor="business_registration_number">Business_registration_number:</label>
        <input
          type="text"
          name="business_registration_number"
          value={user.business_registration_number}
          onChange={handleChange}
        />

        <h4>Address:</h4>

        {user.address.map((address, index) => (
          <input
            key={index}
            type="text"
            name={index}
            value={address}
            onChange={handleAddressChange}
            required
          />
        ))}

        <button
          type="button"
          onClick={() =>
            setUser((prevUser) => ({
              ...prevUser,
              address: [...prevUser.address, ''],
            }))
          }
        >
          Add Address
        </button>

        <label htmlFor="default_address">Default Address:</label>
        <input
          type="number"
          name="default_address"
          value={user.default_address || ''}
          onChange={handleChange}
        />
         <h4>Account_Ids:</h4>

        {user.account_ids.map((account_ids, index) => (
          <input
            key={index}
            type="text"
            name={index}
            value={account_ids}
            onChange={handleAccountChange}
            required
          />
        ))}

        <button
          type="button"
          onClick={() =>
            setUser((prevUser) => ({
              ...prevUser,
              account_ids: [...prevUser.account_ids, ''],
            }))
          }
        >
          Add account
        </button>
        <label htmlFor="default_id">Default Account ID:</label>
        <input
          type="number"
          name="default_id"
          value={user.default_id || ''}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SellerRegister;