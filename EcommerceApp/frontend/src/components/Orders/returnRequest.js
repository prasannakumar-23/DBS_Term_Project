import React, { useState ,useEffect} from "react";
import axios from "axios";

const ReturnRequest = () => {
  const [cartItems, setCartItems] = useState([]);
//   const [orderTotal, setOrderTotal] = useState(0);
//   const [products, setProducts] = useState([]);
//   const [otp,setOtp]=useState();


  useEffect(() => {
    axios
      .post("http://localhost:8800/api/order/fetchReturnRequests",{seller_email: localStorage.getItem("username")})
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
    const seller_email= localStorage.getItem("username")
    axios.post("http://localhost:8800/api/order/acceptReturn",{op_id: op_id,seller_email:seller_email}).then((res)=>console.log(res)).catch((err)=>console.log(err))
  }
  
  const handleCancel = async(op_id) => {
    const email = localStorage.getItem("username"); 
    axios.post("http://localhost:8800/api/order/rejectReturn",{op_id: op_id,seller_email:email})
    .then((res)=>console.log(res))
    .catch((err)=>console.log(err))
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
            <button
              onClick={() =>
               handleReturn(
                  product.op_id
                )
              }
            >
              Accept
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
        
        
          </div>
          
        ))}
        
      </div>
    </div>
  )
            }

export default ReturnRequest;


/*

 const handleOtpSubmit =async (otp,op_id)=>{
    axios.post("http://localhost:8800/api/order/handleDelivery",{otp: otp,op_id: op_id})
    .then((res)=>console.log(res))
    .catch((err)=>console.log(err))
 }
 const handleOtp=async(e)=>{
    setOtp(e.target.value)
 }

*/