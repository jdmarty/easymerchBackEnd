const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    //find all products
    const productData = await Product.findAll({
      include: [
        //join with Category on matching category_id
        { model: Category }, 
        //join with Tag after finding matching id in ProductTag named 'tag'
        { model: Tag, through: ProductTag, as: 'tags' }
      ]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    //find one product by the associated id
    const productData = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        //join the product model with the tags object created by association in model index 
        { model: Tag, through: ProductTag, as: 'tags' }
      ]
    });

    if (!productData) {
      res.status(404).json({ message: "No product found with this id!" });
      return
    };

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// // create new product
router.post('/', async (req,res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    //create a new product from the request body
    const newProduct = await Product.create(req.body);
    //if tags were sent with the original request...
    if (req.body.tagIds.length) {
      //map the provided tags into an object to bulk create ProductTags
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id,
        };
      });
      //create new product tags
      const newProductTags = await ProductTag.bulkCreate(productTagIdArr);
      //send the new product and tags in the response object
      res.status(200).json({
        newProduct,
        newProductTags,
      });
    //otherwise send only the new product in the response
    } else {
      res.status(200).json(newProduct);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//update product
router.put('/:id', async (req, res) => {
  try {
    //update the the Product at the supplied id
    const updatedProduct = await Product.update(req.body, {
      where: { id: req.params.id },
    });
    //get all the ProductTags for this product
    const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
    //get a list of tags associated with this product
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    //create filtered list of tags not currently associated with this product
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
    //create list of tags that should be removed
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);
    //destroy products that need remove and create those that need to be added
    const updatedData = await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);
    res.json({
      productUpdates: updatedProduct[0],
      removedProductTags: updatedData[0],
      newProductTags: updatedData[1]
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    //find all ProductTags for this project
    const productTagsToRemove = await ProductTag.findAll({ where: { product_id: req.params.id } });
    const productTagIdsToRemove = productTagsToRemove.map(({ id }) => id);
    //remove ProductTags and Products that match the provided ids
    const removedItems = await Promise.all([
      ProductTag.destroy({ where: { id: productTagIdsToRemove } }),
      Product.destroy({ where: { id: req.params.id } })
    ]);
    res.status(200).json({
      deletedProducts: removedItems[1],
      deletedProductTags: removedItems[0]
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
