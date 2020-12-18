// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id'
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id',
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  //pass through the ProductTag table to and match the two reference categories
  //product_id and tag_id are in ProductTag and reference both Product and Tag
  through: {
    model: ProductTag,
    unique: false,
  },
  //name the returned object "tags"
  as: "tags"
})

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: {
    model: ProductTag,
    unique: false,
  },
  as: "products",
});


module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
