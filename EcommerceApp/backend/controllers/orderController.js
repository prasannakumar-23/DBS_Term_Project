const {Order,OrderProduct,OrderWarehouse,OrderVerdictUnclear,OrderVerdictClear} = require('../models/order');
const Cart= require('../models/cart')
const {ProductItem,Product} = require('../models/product');
const axios = require('axios');
const User = require('../models/user');
const Seller= require('../models/seller')
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const {Warehouse}=require('../models/warehouse')

const transferAPI = 'http://localhost:5050/transfer';


const ecommerceUserName="ecomm"
const ecommercePassword="2003"
const ecommerceAccountId="9345687"



exports.placeOrder = async (req, res) => {
  const userEmail = req.body.email;
  const orderTotal = req.body.orderTotal;
  const userAccountId = req.body.senderAccountId;
  const appAccountId = ecommerceAccountId ;
  const username=req.body.username;
  const password=req.body.password;
  console.log("user Email",userEmail)
  // Check if all items in the user's cart are in stock
  const cartItems = await Cart.findAll({
    where: {
      email: userEmail,
    },
    include: [
      {
        model: ProductItem,
        required: true,
      },
    ],
  });

  let insufficientStock = false;
  cartItems.forEach(async (item) => {
    console.log(item)
    console.log("Logged Item")
    console.log(item.product_item_id)
    console.log(item.quantity)
    const prodItem=await ProductItem.findOne({where: {id : item.product_item_id}})
    console.log(prodItem)
    console.log(prodItem.qty)
    if (item.quantity > prodItem.qty) {
      insufficientStock = true;
      res.status(400).send(`Item ${prodItem.id} is out of stock`);
    }
  });

  // Proceed with order if all items are in stock
  if (!insufficientStock) {
    // Transfer funds using the transfer API
    console.log("sufficient stock")
    const transferBody = {
      senderAccountId: userAccountId,
      receiverAccountId: appAccountId,
      amount: orderTotal,
      username:username,
      password:password
    };

    try {
      console.log("In try block")
      const transferResponse = await axios.post(transferAPI, transferBody);
      const transactionId = transferResponse.data;
      console.log("Transcation done")
     // console.log(transferResponse)
      console.log("Data")
     // console.log(transferResponse.data)
      // Create a new order in the Order table
      const newOrder = await Order.create({
        user_email: userEmail,
        order_total: orderTotal,
        transaction_id: transactionId.toString(),
      });
     // console.log("Order created")
     // console.log(cartItems)
      // Create entries in the OrderProduct table for each item in the cart
      const orderProducts = await Promise.all(cartItems.map((item) => {
        return {
          order_id: newOrder.order_id,
          product_item_id:item.product_item_id,
          quantity: item.quantity,
          price: item.price,
        };
      }));
     //console.log("Order Products")
     // console.log(orderProducts)
      await OrderProduct.bulkCreate(orderProducts);

      // Create an entry in the OrderWarehouse table for each product in the order
      const orderWarehouses = await Promise.all(cartItems.map(async (item) => {

        const x= await OrderProduct.findOne({
        where: {
          order_id: newOrder.order_id,
        product_item_id: item.product_item_id
              }
          })
          console.log("X OP ID FROM ORDER WAREHOUSE",x.op_id)
          console.log("X  FROM ORDER WAREHOUSE",x)
      function getRandomInt(min, max) {
         min = Math.ceil(min);
         max = Math.floor(max);
         return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      function generateRandomTimestamp(){
  // Generate a random number between 172800000 and 432000000 milliseconds (2 to 5 days)
        const randomTime = Math.floor(Math.random() * (432000000 - 172800000 + 1)) + 172800000;
        const currentTime = Date.now();
        const randomTimestamp = new Date(currentTime + randomTime);
        return randomTimestamp;
          }


        return {
          op_id: x.op_id,
          warehouse_id: getRandomInt(1, 12),
          arrival_date: generateRandomTimestamp()
         };
        }));
      // console.log("Order Warehouse")
     //  console.log(orderWarehouses)
      await OrderWarehouse.bulkCreate(orderWarehouses);

      const order_verdict_unclear=await Promise.all(cartItems.map(async (item)=>{
        const x=await OrderProduct.findOne({
        where: {
          order_id: newOrder.order_id,
        product_item_id: item.product_item_id
              }
          })
          const now = new Date();
          const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
          const timestamp = sevenDaysFromNow.getTime();
          const prodItem=await ProductItem.findOne({where: {id : item.product_item_id}})
          max=1000;
          min=1000000;
          console.log("User email in ovc ",userEmail)
          jsi={
          op_id: x.op_id,
          user_email: userEmail,
          seller_email: prodItem.email,
          otp: Math.floor(Math.random() * (max - min + 1)) + min,
          status_id: "TBD",
          date: timestamp,
         }
          console.log(jsi)
          return {
          op_id: x.op_id,
          user_email: userEmail,
          seller_email: prodItem.email,
          otp: Math.floor(Math.random() * (max - min + 1)) + min,
          status_id: "TBD",
          date: timestamp,
         };

      }));

      console.log("Order verdict unclear");
      console.log(order_verdict_unclear);
     await OrderVerdictUnclear.bulkCreate(order_verdict_unclear);
      cartItems.forEach(async (item)=>{
        const prodItem = await ProductItem.findOne({ where: { id: item.product_item_id } });
        prodItem.qty -= item.quantity;
        await prodItem.save();
      })

      res.status(200).send('Order placed successfully');
    } catch (error) {
      console.log("In error")
      res.status(400).send(`Insufficient funds: ${error.message}`);
    }
  }
};







exports.handleCancel = async (req, res) => {
  const { op_id, email } = req.body;

  try {
    // Find the order in the unclear table
    const order = await OrderVerdictUnclear.findOne({ where: { op_id } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the status is TBD
    if (order.status_id !== 'TBD') {
      return res.status(400).json({ message: 'Order status is not TBD' });
    }

    // Delete the order from the unclear table
    await OrderVerdictUnclear.destroy({ where: { op_id } });

    // Add the order to the clear table with status CAN
    await OrderVerdictClear.create({ op_id, status_id: 'CAN' });

    // Get the user account IDs from MongoDB

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { account_ids, default_id } = user;

    // Get the order price from the OrderProduct table
    const orderProduct = await OrderProduct.findOne({
      where: { op_id },
      attributes: ['price'],
    });
    console.log('Order product!!!!!',orderProduct)
    if (!orderProduct) {
      console.log("Screaming: In !order product")
      return res.status(404).json({ message: 'Order product not found' });
    }
    const { price } = orderProduct;

    // Issue a transfer request
    const data = {
      senderAccountId: ecommerceAccountId,
      receiverAccountId: account_ids[default_id],
      amount: price,
      username:ecommerceUserName,
      password:ecommercePassword
    };
    console.log("Above the axios request!!!!!!!")
    await axios.post('http://localhost:5050/transfer', data);

    return res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




exports.handleDelivery = async (req, res) => {
  const { otp,op_id} = req.body;
  console.log("Handling delivery ",otp,op_id)
  console.log(typeof op_id)
  try {
    // Search for the order verdict with matching op_id and HOL status
    const orderVerdict = await OrderVerdictUnclear.findOne({
      where: { op_id: op_id, status_id: 'HOL' }
    });
    console.log("ORDER VERDICT ",orderVerdict)
    if (!orderVerdict) {
      const orderVerdict = await OrderVerdictUnclear.findOne({
          where: { op_id: op_id, status_id: 'RHOL' }
      });
      if(!orderVerdict){
        return res.status(404).json({ error: 'Order verdict not found' });
      }
      else{
        if (orderVerdict.otp !== otp) {
          return res.status(400).json({ error: 'Invalid OTP' });
        }
        await OrderVerdictUnclear.destroy({ where: { op_id } });
        await OrderVerdictClear.create({ op_id, status_id: 'RDEL' });
        return res.status(200).json({ message: 'Order verdict updated successfully' });

      }
    }
    else{
    // Check if the OTP matches
    if (orderVerdict.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Update the status to DEL and the date to 7 days from now
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 7);

    await orderVerdict.update({
      status_id: 'DEL',
      date: newDate
    });

    return res.status(200).json({ message: 'Order verdict updated successfully' });
  }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.handleReturn = async (req, res) => {
  const { op_id} = req.body;

  try {
    // Search for the order verdict with matching op_id and HOL status
    const orderVerdict = await OrderVerdictUnclear.findOne({
      where: { op_id, status_id: 'DEL' }
    });

    if (!orderVerdict) {
      return res.status(404).json({ error: 'Order verdict not found' });
    }

    // Check if the OTP matches
    // if (orderVerdict.otp !== otp) {
    //   return res.status(400).json({ error: 'Invalid OTP' });
    // }

    // Update the status to DEL and the date to 7 days from now
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 7);

    await orderVerdict.update({
      status_id: 'RRS',
      date: newDate
    });

    return res.status(200).json({ message: 'Order verdict updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



//////ACCEPT/////



exports.acceptReturn = async(req,res)=>{
  const { op_id,seller_email} = req.body;
  try{
    const orderVerdict = await OrderVerdictUnclear.findOne({
      where: { op_id, status_id: 'RRS' }
    });
    const email = orderVerdict.user_email
     if (!orderVerdict) {
      return res.status(404).json({ error: 'Order verdict not found' });
    }
    await OrderVerdictUnclear.destroy({ where: { op_id } });
    await OrderVerdictClear.create({ op_id, status_id: 'RET' });
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { account_ids, default_id } = user;

    // Get the order price from the OrderProduct table
    const orderProduct = await OrderProduct.findOne({
      where: { op_id },
      attributes: ['price'],
    });
    console.log('Order product!!!!!',orderProduct)
    if (!orderProduct) {
      console.log("Screaming: In !order product")
      return res.status(404).json({ message: 'Order product not found' });
    }
    const { price } = orderProduct;
    price=0.9*price;
    // Issue a transfer request
    const data = {
      senderAccountId: ecommerceAccountId,
      receiverAccountId: account_ids[default_id],
      amount: price,
      username:ecommerceUserName,
      password:ecommercePassword
    };
    console.log("Above the axios request!!!!!!!")
    await axios.post('http://localhost:5050/transfer', data);

    return res.status(200).json({ message: 'Order cancelled successfully' });

  }
  catch{
    return res.status(500).json({ error: 'Internal server error' });
  }
}


//FOR ACCEPT INCREASE PRODUCT QUANTITY IF POSSIBLE
//////REJECT/////

exports.fetchReturnRequests = async (req, res) => {
  const { seller_email } = req.body;
  try {
    const returnRequests = await OrderVerdictUnclear.findAll({
      where: {
        seller_email,
        status_id: 'RRS'
      }
    });
    const returns = await Promise.all(returnRequests.map(async (order) => {
      console.log("Order",order)
      const { op_id, status_id} = order;
      
      const orderProd=await OrderProduct.findOne({where: {op_id:op_id}})
      console.log("Order Prod ",orderProd)
      const prodItem= await ProductItem.findOne({where: { id: orderProd.product_item_id }});
      const prod= await Product.findOne({where: { id: prodItem.product_id }});
      const { name, description } = prod;
      price=orderProd.price
      return {
        product_name: name,
        description,
        status_id ,
        op_id,
        price: price
      };
    }));
    console.log("returns ",returns)
    res.status(200).json(returns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

exports.rejectReturn = async(req,res)=>{
  const { op_id,seller_email} = req.body;
  try{
    console.log('Hello ',op_id)
    const orderVerdict = await OrderVerdictUnclear.findOne({
      where: { op_id, status_id: 'RRS' }
    })
    console.log('Order verdict!!!! ',orderVerdict)
     if (!orderVerdict) {
      return res.status(404).json({ error: 'Order verdict not found' });
    }
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 7);

    await orderVerdict.update({
      status_id: 'RTBD',
      date: newDate
    });

    console.log("Update done to orderverdict")
    // await OrderVerdictUnclear.destroy({ where: { op_id } });
    // await OrderVerdictClear.create({ op_id, status_id: 'RET' });

    const user = await Seller.findOne({ email: seller_email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("Seller found ",user)
    const { account_ids, default_id } = user;

    // Get the order price from the OrderProduct table
    const orderProduct = await OrderProduct.findOne({
      where: { op_id },
      attributes: ['price'],
    });
    console.log('Order product!!!!!',orderProduct)
    if (!orderProduct) {
      console.log("Screaming: In !order product")
      return res.status(404).json({ message: 'Order product not found' });
    }
    const { price } = orderProduct;
    price=0.9*price;
    // Issue a transfer request
    const data = {
      senderAccountId: ecommerceAccountId,
      receiverAccountId: account_ids[default_id],
      amount: price,
      username:ecommerceUserName,
      password:ecommercePassword
    };
    console.log("Above the axios request!!!!!!!")
    await axios.post('http://localhost:5050/transfer', data);

    return res.status(200).json({ message: 'Order cancelled successfully' });

  }
  catch{
    return res.status(500).json({ error: 'Internal server error' });
  }
}



exports.fetchOrder = async (req, res) => {
  const { user_email } = req.body;

  try {
    const temp1 = await OrderVerdictUnclear.findAll({
      where: { user_email }
    });

    console.log("TEMP1")
    console.log(temp1)


    


    

    const temp2 = await ProductItem.findAll({
      include: [{ model: Product }]
    });


    console.log("TEMP2")
    console.log(temp2)

    const orders = await Promise.all(temp1.map(async (order) => {
      console.log("Order",order)
      const { op_id, date, product_item_id, status_id, price, quantity } = order;
      const orderWarehouse=await OrderWarehouse.findOne({where:{op_id:order.op_id}})
      const warehouse_id = orderWarehouse.warehouse_id;
      const warehouse = "Warehouse "+warehouse_id.toString()
      console.log("OD",product_item_id)
      const orderProd=await OrderProduct.findOne({where: {op_id:order.op_id}})
      console.log("Order Prod ",orderProd)
      const prodItem= await ProductItem.findOne({where: { id: orderProd.product_item_id }});
      const prod= await Product.findOne({where: { id: prodItem.product_id }});
      const { name, description } = prod;

      return {
        product_name: name,
        description,
        status_id ,
        op_id,
        date: date,
        warehouse: warehouse,
        price: orderProd.price
      };
    }));

    console.log(orders)
    
    res.json(orders);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};;

