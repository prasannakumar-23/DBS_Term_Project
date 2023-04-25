import React, { useState} from 'react';
import { } from 'react-router-dom';
import axios from 'axios';
import './productUpload.css';

const UploadProduct = () => {

  const [user, setUser] = useState({
    category: '',
    name: '',
    description: '',
    email: '',
    quantity: null,
    price: null,
    variations: [],
    sku: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleVariations = (e) => {
    const { name, value } = e.target;
    const { variations } = user;

    variations[Number(name)] = value;

    setUser((prevUser) => ({
      ...prevUser,
      variations,
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user)
    try {
      await axios.post('http://localhost:8800/api/product/', user);
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          name="category"
          value={user.category}
          onChange={handleChange}
          required
        />
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description:</label>
        <input
          type="text"
          name="description"
          value={user.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="text"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="sku">SKU:</label>
        <input
          type="text"
          name="sku"
          value={user.sku}
          onChange={handleChange}
          required
        />

        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          name="quantity"
          value={user.quantity}
          onChange={handleChange}
          required
        />

        <label htmlFor="price">Price:</label>
        <input
          type="number"
          name="price"
          value={user.price}
          onChange={handleChange}
          required
        />

        <h4>Variation:</h4>

        {user.variations.map((variations, index) => (
          <input
            key={index}
            type="text"
            name={index}
            value={variations}
            onChange={handleVariations}
            required
          />
        ))}

        <button
          type="button"
          onClick={() =>
            setUser((prevUser) => ({
              ...prevUser,
              variations: [...prevUser.variations, ''],
            }))
          }
          
        >
          Add Variation
        </button>

        

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UploadProduct;
