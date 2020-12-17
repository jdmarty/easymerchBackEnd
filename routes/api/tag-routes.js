const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: {model: Product, through: ProductTag, as: "products"}
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }  
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: { model: Product, through: ProductTag, as: "products" },
    });
    
    if (!tagData) {
      res.status(404).json({ message: "No category found with this id!" });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }  
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);
    console.log(`New category ${req.body.tag_name} created`);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  };
});

router.put('/:id', async (req, res) => {
  try {
    //update tag with new data from provided body at the provided id
    const updatedTag = await Tag.update(req.body, { 
      where: { id: req.params.id } 
    });
    //if no matching model was found, send message
    if (!updatedTag[0]) {
      res.status(404).json({ message: "No category found with this id!" });
      return;
    }
    res.status(200).json(updatedTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', (req, res) => {
  try {
    //delete a tag at the provided id
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    //if no matching model was found, send message
    if (!deletedCategory) {
      res.status(404).json({ message: "No category found with this id!" });
      return
    }
    res.status(200).json(deletedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
