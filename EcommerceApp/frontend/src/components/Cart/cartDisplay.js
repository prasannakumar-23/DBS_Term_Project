import React, { useState ,useEffect} from "react";
import axios from "axios";
import "./cartDisplay.css";

const DisplayCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
//   const [products, setProducts] = useState([]);
  


  useEffect(() => {
    axios
      .post("http://localhost:8800/api/cart/displayCart",{email: localStorage.getItem("username")})
      .then((response) => {
        setCartItems(response.data);
        setOrderTotal(
          response.data.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          )
         
        );
         console.log(response)
      })
      .catch((error) => console.log(error));
  }, []);

  const handleEmptyCart = () => {
    const email = localStorage.getItem("username");
    axios
      .post("http://localhost:8800/api/cart/emptyCart",{email})
      .then(() => setCartItems([]))
      .catch((error) => console.log(error));
  };

  const handleModifyCart = (product_item_id,quantity,price) => {
    const email = localStorage.getItem("username");
    price=quantity*price
    axios
      .post("http://localhost:8800/api/cart/modifyCart", {
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

  const handleOrder = () => {
    const email = localStorage.getItem("username");
    axios.post("http://localhost:8800/api/users/getDetails",{email:email})
    .then((response)=>{
        console.log('Account id of the user ',response.data.account_id)
        axios.post("http://localhost:5050/getDetails",{account_id:response.data.account_id})
        .then((res)=>{
            console.log('username ',res.data.username)
            console.log('password ',res.data.password)
            const reqBody={
                email:email,
                orderTotal:orderTotal,
                senderAccountId: response.data.account_id,
                username: res.data.username,
                password: res.data.password
            }
            console.log("Req body ",reqBody)
            console.log("account_id ",response.data.account_id)
        axios.post("http://localhost:8800/api/order/",reqBody).then((resi)=>console.log(resi)).catch((err)=>console.log(err))
        })
        .catch((error) => {
        console.log(error);
      })
    })
    .catch((error) => {
        console.log(error);
      })
  };

  const handleChange = (event, index) => {
    const { value } = event.target;
    const updatedProducts = [...cartItems];
    updatedProducts[index].quantity = parseInt(value);
    setCartItems(updatedProducts);
  };


  return (
    <div className="display-product">
        <div className="display-cart-header">
        <button onClick={handleEmptyCart}>Empty Cart</button>
      </div>
      <div className="product-list">
        {cartItems.map((product, index) => (
          <div className="product-item" key={product.product_item_id}>
            <h3>{product.product_name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Quantity: ${product.quantity}</p>
            <label htmlFor={`quantity-${index}`}>Change Quantity To:</label>
            <input
              type="number"
              id={`quantity-${index}`}
              value={product.quantity || 1}
              onChange={(e) => handleChange(e, index)}
            />
            <button
              onClick={() =>
               handleModifyCart(
                  product.product_item_id,
                  product.quantity || 1,
                  product.price
                )
              }
            >
              Modify Cart
            </button>
            <div>Product Item Price: {product.price*product.quantity}</div>
          </div>
          
        ))}
        <div className="display-cart-footer">
            <div>{`Order Total: $${orderTotal}`}</div>
            <button onClick={handleOrder}>Order</button>
        </div>
      </div>
    </div>
  )
            }

export default DisplayCart;