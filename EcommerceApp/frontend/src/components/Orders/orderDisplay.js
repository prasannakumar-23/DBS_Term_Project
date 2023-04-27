import React, { useState ,useEffect} from "react";
import axios from "axios";

const DisplayOrder = () => {
  const [cartItems, setCartItems] = useState([]);
//   const [orderTotal, setOrderTotal] = useState(0);
//   const [products, setProducts] = useState([]);
  const [otp,setOtp]=useState();


  useEffect(() => {
    axios
      .post("http://localhost:8800/api/order/fetchOrder",{user_email: localStorage.getItem("username")})
      .then((response) => {
        setCartItems(response.data);
        // setOrderTotal(
        //   response.data.reduce(
        //     (total, item) => total + item.price * item.quantity,
        //     0
        //   )
         
        // );
         console.log(response)
      })
      .catch((error) => console.log(error));
  }, []);

//   const handleEmptyCart = () => {
//     const email = localStorage.getItem("username");
//     axios
//       .post("http://localhost:8800/api/cart/emptyCart",{email})
//       .then(() => setCartItems([]))
//       .catch((error) => console.log(error));
//   };

 
  const handleReturn = async(op_id) => {
    
    axios.post("http://localhost:8800/api/order/returnDelivery",{op_id: op_id}).then((res)=>console.log(res)).catch((err)=>console.log(err))
  }
  
  const handleCancel = async(op_id) => {
    const email = localStorage.getItem("username"); 
    axios.post("http://localhost:8800/api/order/cancelOrder",{op_id: op_id,email:email})
    .then((res)=>console.log(res))
    .catch((err)=>console.log(err))
  }

 const handleOtpSubmit =async (otp,op_id)=>{
    axios.post("http://localhost:8800/api/order/handleDelivery",{otp: otp,op_id: op_id})
    .then((res)=>console.log(res))
    .catch((err)=>console.log(err))
 }
 const handleOtp=async(e)=>{
    setOtp(e.target.value)
 }

//   const handleChange = (event, index) => {
//     const { value } = event.target;
//     const updatedProducts = [...cartItems];
//     updatedProducts[index].quantity = parseInt(value);
//     setCartItems(updatedProducts);
//   };


  return (
    <div className="display-product">
      <div className="product-list">
        {cartItems.map((product, index) => (
          <div className="product-item" key={product.product_item_id}>
            <h3>{product.product_name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Status: ${product.status_id}</p>
            <p>Warehouse: ${product.warehouse}</p>
            <button
              onClick={() =>
               handleReturn(
                  product.op_id
                )
              }
            >
              Return
            </button>
            <button
              onClick={() =>
               handleCancel(
                  product.op_id
                )
              }
            >
             Cancel
            </button>
            <div>Product Item Price: {product.price*product.quantity}</div>
        <label htmlFor="otp">Otp:</label>
        <input
          type="text"
          name="otp"
          onChange={handleOtp}
        />
        <button
              onClick={() =>
               handleOtpSubmit(
                otp,product.op_id
                  
                )
              }
            >
             Otp Submit
            </button>
          </div>
          
        ))}
        
      </div>
    </div>
  )
            }

export default DisplayOrder;


/*

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




*/