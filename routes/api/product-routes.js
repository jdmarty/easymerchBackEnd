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
      res.status(404).json({ message: "No category found with this id!" });
      return
    };

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */

 // Create a new product
  Product.create(req.body)  
  .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      //if tags are sent in the body...
      if (req.body.tagIds) {
        // get list of current tag_ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        // create filtered list of new tag_ids
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
        // figure out which ones to remove
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);

        // run both actions
        return Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      } else {
        return productTags
      }
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
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
    res.status(200).json(removedItems);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
