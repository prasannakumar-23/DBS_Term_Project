const  Cart  = require('../models/cart');
const { ProductCategory, Product, ProductItem, Variation, VariationOption, ProductConfig } = require('../models/product');


const addToCart = async (req, res) => {
  const { email, product_item_id, quantity, price } = req.body;
  
  try {
    console.log(Cart)
    let cartItem = await Cart.findOne({
      where: {
        email,
        product_item_id,
      }
    });

    if (cartItem) {
      // If the item already exists in the cart, update the quantity and price
      console.log(typeof cartItem.quantity)
      console.log(typeof cartItem.price)
      console.log(typeof quantity)
      const updatedQuantity = cartItem.quantity + parseInt(quantity);
      const updatedPrice = cartItem.price + parseInt(price);
      console.log(cartItem.quantity)
      console.log(cartItem.price)
      console.log(price)
      console.log(quantity)

      await Cart.update(
        { quantity: updatedQuantity, price: updatedPrice },
        { where: { email, product_item_id } }
      );

      res.status(200).json({ message: 'Cart updated successfully.' });
    } else {
      // If the item does not exist in the cart, add a new row
      await Cart.create({
        email,
        product_item_id,
        quantity,
        price,
      });

      res.status(201).json({ message: 'Item added to cart successfully.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

const modifyCart = async (req, res) => {
  const { email, product_item_id, quantity, price } = req.body;

  try {
    let cartItem = await Cart.findOne({
      where: {
        email,
        product_item_id,
      },
    });

    if (cartItem) {
      // If the item already exists in the cart, update the quantity and price
      const updatedQuantity = parseInt(quantity);
      const updatedPrice = parseInt(price);

      await Cart.update(
        { quantity: updatedQuantity, price: updatedPrice },
        { where: { email, product_item_id } }
      );

      res.status(200).json({ message: 'Cart updated successfully.' });
    } else {
      // If the item does not exist in the cart, add a new row
      await Cart.create({
        email,
        product_item_id,
        quantity,
        price,
      });

      res.status(201).json({ message: 'Item added to cart successfully.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

const emptyCart = async (req, res) => {
  const { email } = req.body;

  try {
    await Cart.destroy({
      where: {
        email,
      },
    });

    res.status(200).json({ message: 'Cart emptied successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

const displayCart= async (req, res) => {
  const { email } = req.body;

  try {
    const cartItems = await Cart.findAll({
      where: { email },
      include: [{ model: ProductItem }]
    });

    const productItems = cartItems.map((item) => item.ProductItem);

    const products = await Promise.all(productItems.map(async (item) => {
      const product = await Product.findOne({ where: { id: item.product_id } });
      const { id: product_item_id, price } = item;
      const { name, description } = product;
      const { quantity } = cartItems.find((cartItem) => cartItem.product_item_id === item.id);
      return { product_item_id, name, description, price, quantity };
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  addToCart,
  modifyCart,
  emptyCart,
  displayCart
};
