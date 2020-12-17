const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    //find all categories and include associated products
    const categoriesData = await Category.findAll({
      include: { model: Product },
      order: ['id']
    })
    res.status(200).json(categoriesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    //find one category with matching id and include associated products
    const categoryData = await Category.findByPk(req.params.id, {
      include: { model: Product },
    });
    //if no data is returned, send a 404 error
    if (!categoryData) {
      res.status(404).json({ message: "No category found with this id!" });
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    //create a new category from the provided body
    const newCategory = await Category.create(req.body);
    console.log(`New category ${req.body.category_name} created`)
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    //update category with new data from provided body at the provided id
    const updatedCategory = await Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        where: { id: req.params.id }
      },
    )
    if (!updatedCategory[0]) {
      res.status(404).json({ message: "No category found with this id!" });
    }
    res.status(200).json({ message: 'Category name updated!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    //delete a category at the provided id
    const deletedCategory = await Category.destroy({
      where: {
        id: req.params.id,
      }
    })
    res.status(200).json({ message: "Category deleted!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
