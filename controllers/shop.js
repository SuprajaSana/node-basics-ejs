const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
 Product.findAll()
   .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
   })
   .catch((err) => {
     console.log(err);
   });

};

exports.getProduct = (req, res, next) => {
  const proId = req.params.productId;
  Product.findAll({ where: { id:proId } }).then(product => {
    console.log(product)
     res.render("shop/product-detail", {
       product: product[0],
       pageTitle: product[0].title,
       path: "/products",
     });  
  }).catch((err)=>console.log(err))
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
     res.render("shop/index", {
       prods: products,
       pageTitle: "Shop",
       path: "/",
     });
  }).catch((err)=>{console.log(err)});
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({where:{userId:1}})
        .then(products => {
         res.render("shop/cart", {
           path: "/cart",
           pageTitle: "Your Cart",
           products: products,
         });
        })
      .catch(err=>console.log(err))
    })
  .catch(err=>console.log(err))
 /*  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData=cart.products.find(prod=>prod.id===product.id)
       if (cartProductData) {
       cartProducts.push({productData:product,qty:cartProductData.qty})
       }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products:cartProducts
      });
    })
  }) */
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
    return cart.getProducts({where:{id:prodId}})
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }  
      if (product) {
        const quant = product.cartItem.quantity;
        newQuantity = quant + 1;
        return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
      }
      return Product.findByPk(prodId)
    })
    .then(product => {
       return fetchedCart.addProduct(product, {
         through: { quantity: newQuantity },
       });
    })
    .then(() => {
      res.redirect('/cart');
    })
  .catch(err=>console.log(err))
};

exports.postCartDeleteItems = (req, res, next) => {
  const prodId = req.body.productId;
 /* Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  }) */

  let fetchedCart;
  let newQuantity;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
    return cart.getProducts({where:{id:prodId}})
    })
    .then(products => {
     let product;
     if (products.length > 0) {
       product = products[0];
     }
      const quant = product.cartItem.quantity;
     if (quant>1) {
       newQuantity = quant - 1;
       return fetchedCart.addProduct(product, {
         through: { quantity: newQuantity },
       });
     }
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect('/cart');
    })
  .catch(err=>console.log(err))
}

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};



