const { ProductCategory, Product, ProductItem, Variation, VariationOption, ProductConfig } = require('../models/product');

exports.postProduct = async(req,res)=>{
    const { category, name, description, variations, quantity, price, email, sku } = req.body;
    console.log(category, name, description, variations, quantity, price, email, sku)
    console.log(ProductCategory)
  // Check if Category is present
  let categoryRecord = await ProductCategory.findOne({ where: { category_name: category } });
  if (!categoryRecord) {
    // If not, create new category
    categoryRecord = await ProductCategory.create({ category_name: category });
  }

  // Check if Product is present in that category
  let productRecord = await Product.findOne({ where: { category_id: categoryRecord.id, name: name } });
  if (!productRecord) {
    // If not, create new product
    productRecord = await Product.create({ category_id: categoryRecord.id, name: name, description: description });
  }

  // Check if all variations are present
  const variationIds = [];
  console.log(typeof variations)
  // const variations_list = variations.slice(1, -1).split(",");
  const variations_list=variations
  for (const variation of variations_list) {
    const [variationCategory, variationValue] = variation.split(':').map(x => x.trim());
    console.log('Hello')
    console.log(variationCategory,variationValue)
    // Check if variation category exists
    let variationRecord = await Variation.findOne({ where: { category_id: categoryRecord.id, name: variationCategory } });
    if (!variationRecord) {
      // If not, create new variation
      variationRecord = await Variation.create({ category_id: categoryRecord.id, name: variationCategory });
    }

    // Check if variation option exists
    let variationOptionRecord = await VariationOption.findOne({ where: { variation_id: variationRecord.id, value: variationValue } });
    if (!variationOptionRecord) {
      // If not, create new variation option
      variationOptionRecord = await VariationOption.create({ variation_id: variationRecord.id, value: variationValue });
    }

    variationIds.push(variationOptionRecord.id);
  }

  // Check if Product Item already exists with the same variations and email
  const productItems = await ProductItem.findAll({ where: { product_id: productRecord.id } });
  let existingProductItem;
  for (const productItem of productItems) {
    const configs = await productItem.getProductConfigs();
    const configIds = configs.map(config => config.variation_option_id).sort();
    const newConfigIds = variationIds.concat().sort();
    if (email === productItem.email && configIds.join(',') === newConfigIds.join(',')) {
      existingProductItem = productItem;
      break;
    }
  }

  if (existingProductItem) {
    // If Product Item already exists, increase quantity
    console.log("In if!!!!!!!")
    console.log("Type of quantity ",typeof  existingProductItem.qty)
     console.log("Type of price ",typeof  existingProductItem.price)
    existingProductItem.qty += Number(quantity);
    await existingProductItem.save();
  } else {
    // If Product Item does not exist, create new Product Item
    console.log("In else!!!!!!!")
    const productItem = await ProductItem.create({ product_id: productRecord.id, SKU: sku, qty: quantity, price: price, email: email });

    // Add Product Configs for each variation
    for (const variationId of variationIds) {
      await ProductConfig.create({ product_item_id: productItem.id, variation_option_id: variationId });
    }
  }

  res.send('Product added successfully');
}

exports.fetchProductCat= async (req,res)=>{
  const category_name=req.query.category_name
  console.log(req.query)
   console.log('CAT_NAME ',category_name)
   try {
    const category = await ProductCategory.findOne({ where: { category_name: category_name } });
    console.log("PRODCUT CATEGORY DONE")
    console.log(category)

    const products = await Product.findAll({ where: { category_id: category.id } });
    console.log("PRODCUT DONE")
    console.log(products)

    const productItems = await ProductItem.findAll({ where: { product_id: products.map((product) => product.id) },include: [Product], });
    console.log("PRODCUT ITEMS")
    // console.log(productItems)
    console.log(productItems[0].Product)
    const productList = productItems.map((item) => (
     
      
   {
      product_name: item.Product.name,
      description: item.Product.description,
      price: item.price,
      product_item_id: item.id,
    }));

    res.status(201).send(productList);
  } catch (error) {
    console.error(error);
    res.status(500).send([]);
  }
}

exports.fetchProduct= async (req,res)=>{
  const product_name=req.query.product_name
  console.log(req.query)
   console.log('PROD_NAME ',product_name)
   try {
    // const category = await ProductCategory.findOne({ where: { category_name: category_name } });
    // console.log("PRODCUT CATEGORY DONE")
    // console.log(category)

    const products = await Product.findAll({ where: { name: product_name } });
    console.log("PRODCUT DONE")
    console.log(products)
    console.log(products.id)
    const productItems = await ProductItem.findAll({ where: { product_id: products[0].id },include: [Product], });
    console.log("PRODCUT ITEMS")
    // console.log(productItems)
    console.log(productItems[0].Product)
    const productList = productItems.map((item) => (
     
      
   {
      product_name: item.Product.name,
      description: item.Product.description,
      price: item.price,
      product_item_id: item.id,
    }));

    res.status(201).send(productList);
  } catch (error) {
    console.error(error);
    res.status(500).send([]);
  }
}
/*
Modify the quantity of product item
Delete a product item
*/

