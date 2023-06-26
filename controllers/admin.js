const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing:false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId:req.user.id
  }).then(() => {
    console.log('Created Product');
     res.redirect("/admin/products");
  }).catch(err => console.log(err))
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  const prodId = req.params.productId;
  Product.findAll({ where: { id: prodId } }).then(product => {
    console.log(product)
    if (!product) {
      return res.redirect("/")
    }
    console.log(product)
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product:product[0]
    });
  }).catch(err => {
    console.log(err);
  })
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  Product.findAll({ where: { id: prodId } }).then(product => {
    product[0].title = updatedTitle,
      product[0].price = updatedPrice,
      product[0].imageUrl = updatedImageUrl,
      product[0].description = updatedDescription
    return product[0].save();
  }).then(() => {
    console.log('Updated Product');
     res.redirect("/admin/products");
  }).catch(err => {
    console.log(err);
  })
};

exports.getProducts = (req, res, next) => {
   Product.findAll()
     .then(products => {
       res.render("admin/products", {
         prods: products,
         pageTitle: "Admin Products",
         path: "/admin/products",
       });
     })
     .catch((err) => {
       console.log(err);
     });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findAll({ where: { id: prodId } }).then(product => {
    product[0].destroy();
  }).then(() => {
    console.log('Deleted Product');
    res.redirect("/admin/products");
  }).catch((err) => console.log(err));
};



