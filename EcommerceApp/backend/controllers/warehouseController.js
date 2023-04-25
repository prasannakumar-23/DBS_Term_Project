const Warehouse = require('../models/warehouse');


module.exports = {
  addWarehouse: async (req, res) => {
    try {
      const { name, location } = req.body;

      // create a new warehouse with the given name and location
      const newWarehouse = await Warehouse.create({ name, location });

      // send back the new warehouse as the response
      res.json(newWarehouse);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  }
};

