/*
First upon entering the page should display all product items 
Filter by product cat
Filter by product cat and product

product_cat->product->product_items->product configs->variation_options->variations

What should be displayed to the user


Card
Product name,desc,price,adjust quantity,display variations,add to cart button
*/
import React, { useState } from "react";
import axios from "axios";
import "./productDisplay.css";

const DisplayProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchBy, setSearchBy] = useState("product_name");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAdd = (product_item_id, quantity, price) => {
    const email = localStorage.getItem("username");
    price=quantity*price
    axios
      .post("http://localhost:8800/api/cart/addToCart", {
        email,
        product_item_id,
        quantity,
        price,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (event, index) => {
    const { value } = event.target;
    const updatedProducts = [...products];
    updatedProducts[index].quantity = parseInt(value);
    setProducts(updatedProducts);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchBy === "product_cat") {
      axios
        .get(`http://localhost:8800/api/product/fetchProductCat`, {
          params: { category_name: searchTerm },
        })
        .then((response) => {
          setProducts(response.data);
          console.log("Search and display success");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .get(`http://localhost:8800/api/product/fetchProduct`, {
          params: { product_name: searchTerm },
        })
        .then((response) => {
          setProducts(response.data);
          console.log("Search and display success");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="display-product">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="searchTerm"
          value={searchTerm}
          placeholder="Search by product name"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          name="searchBy"
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
        >
          <option value="product_name">Product Name</option>
          <option value="product_cat">Product Category</option>
        </select>
        <button type="submit">Search</button>
      </form>

      <div className="product-list">
        {products.map((product, index) => (
          <div className="product-item" key={product.product_item_id}>
            <h3>{product.product_name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <label htmlFor={`quantity-${index}`}>Quantity:</label>
            <input
              type="number"
              id={`quantity-${index}`}
              value={product.quantity || 1}
              onChange={(e) => handleChange(e, index)}
            />
            <button
              onClick={() =>
                handleAdd(
                  product.product_item_id,
                  product.quantity || 1,
                  product.price
                )
              }
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>

  );
};

export default DisplayProduct;

