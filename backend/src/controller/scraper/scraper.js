//model imports
const Scraper = require("../../model/scraper/scraper.model");
const User = require("../../model/auth/user.model");
const checkAuth = require("../../middleware/auth-check");
const email = require("../common/mail");

//dependency imports
const express = require("express");
const bodyParser = require("body-parser");
const multer = require ("multer");

//express app declaration
const scraper = express();


// multer setup for image upload
const MIME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg' : 'jpg',
  'image/jpg' : 'jpg',
  'image/gif' : 'gif'
};
const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error= new Error("Invalid Image");
    if(isValid){
      error=null;
    }
    cb(error,"src/assets/images/scraper/data");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});


//middleware
scraper.use(bodyParser.json());
scraper.use(bodyParser.urlencoded({ extended: false }));


//add new product
scraper.post('/add',checkAuth, (req, res, next) => {
  // var lastid;
  // Product.find(function (err, products) {
  //   if(products.length){
  //     lastid = products[products.length-1].product_id;
  //   } else {
  //     lastid= 'P0';
  //   }
  //   let mId = +(lastid.slice(1));
  //   ++mId;
  //   lastid = 'P' + mId.toString();
  //   console.log(lastid);
  //   if (err) return handleError(err => {
  //     res.status(500).json({
  //       message: 'Error occured while getting product ID details!'
  //     });
  //   });
  // }).then( () => {
  //   const reqProduct = req.body;
  //   reqProduct['product_id']= lastid;
  //   reqProduct['user_id']= req.userData.user_id;
  //   const newProduct = new Product(reqProduct);
  //   console.log(newProduct);
  //   newProduct.save()
  //   .then(result => {
  //       res.status(200).json({
  //         message: 'product added successfully!',
  //         result: result
  //       });
  //     })
  //     .catch(err=>{
  //       res.status(500).json({
  //         message: 'Product creation was unsuccessful! Please try again!'
  //       });
  //     });
  // });
 });


// add product photos
scraper.post('/add/img',checkAuth, multer({storage:storage}).array("images[]"), (req, res, next) => {
    // const url = req.protocol + '://' + req.get("host");
    // let imagePaths = [];
    // for (let f of req.files){
    //   imagePaths.push(url+ "/images/products/" + f.filename);
    // }
    // res.status(200).json({
    //   imagePaths: imagePaths
    // });

});

//edit product
scraper.post('/edit',checkAuth, (req, res, next) => {
  // const newProduct = new Product(req.body);
  // console.log(newProduct);
  // Product.updateOne({ product_id: req.body.product_id}, {
  //   business_name:  req.body.business_name,
  //   product: req.body.product,
  //   product_category: req.body.product_category,
  //   qty_type: req.body.qty_type,
  //   description: req.body.description,
  //   created_date: req.body.created_date,
  //   created_time: req.body.created_time,
  //   availability: req.body.availability,
  //   inventory: req.body.inventory,
  //   rating: req.body.rating,
  //   no_of_ratings: req.body.no_of_ratings,
  //   no_of_orders: req.body.no_of_orders,
  //   delivery_service: req.body.delivery_service,
  //   price: req.body.price,
  //   pay_on_delivery: req.body.pay_on_delivery,
  //   image_01: req.body.image_01,
  //   image_02: req.body.image_02,
  //   image_03: req.body.image_03,
  //   user_id: req.userData.user_id
  // })
  // .then(result => {
  //   res.status(200).json({
  //     message: 'product updated successfully!',
  //     result: result
  //   });
  // })
  // .catch(err=>{
  //   res.status(500).json({
  //     message: 'Product update was unsuccessful! Please Try again!'
  //   });
  // });
});


//remove a product
scraper.delete('/edit/:id',checkAuth, (req, res, next) => {
  // Product.deleteOne({'product_id': req.params.id}).then(
  //   result => {
  //     console.log(result);
  //     res.status(200).json({ message: "Product deleted!" });
  //   }
  // ).catch((err) => {
  //   res.status(500).json({ message: "Product was not deleted! Please try again!" });
  // })
});


//search products
scraper.post('/search', (req, res, next) => {

  // Product.find({product_category: req.body.category,
  //               price: {$lte: req.body.maxPrice},
  //               pay_on_delivery:req.body.payOnDelivery,
  //               rating: {$gte: req.body.userRating},
  //               'availability': true,
  //               'inventory': {$gte: 1}})
  // .then(result => {
  //     res.status(200).json({
  //       message: 'products recieved successfully!',
  //       products: result
  //     });
  //   })
  //   .catch(err=>{
  //     res.status(500).json({
  //       message: 'No matching products Found!'
  //     });
  //   });
});


// add a rating to a product
scraper.post('/rating/add',checkAuth, (req, res, next) => {
//   var finalRate = 1/ req.body.rate;
//   var nameQuery = EventPlanner.findOne({user_id: req.userData.user_id}).select('first_name last_name');

//   nameQuery.exec().then( (result) => {
//   Product.findOneAndUpdate({ product_id: req.body.id },{
//     $push: {reviews: {
//       user: result.first_name + ' ' + result.last_name,
//       rating: req.body.rate,
//       review: req.body.review,
//     }},
//     $inc: {rating: finalRate }
//   }).then( (result) => {
//     console.log(result);
//     res.status(200).json(
//       {
//         message: 'Rating was Successfull! thanks for contributing!',
//       }
//     );
//   }).catch( (err) => {
//     res.status(500).json(
//       { message: 'Rating unsuccessfull! Please try again'}
//       );
//   });
// }).catch( (err) => {
//   res.status(500).json(
//     { message: 'Rating unsuccessfull! Please try again'}
//     );
// });
});

// add a promotion to a product
scraper.post('/promotion/add',checkAuth, (req, res, next) => {

  // Product.findOneAndUpdate({ product_id: req.body.productId },{
  //   $push: {promotions: req.body.promotion}
  // }).then( (result) => {
  //   console.log(result);
  //   res.status(200).json(
  //     {
  //       message: 'Promotion added Successfully!',
  //     }
  //   );
  // }).catch( (err) => {
  //   res.status(500).json(
  //     { message: 'Promotion unsuccessfull! Please try again'}
  //     );
  // });
});




// get methods

//get list of products for search
scraper.get('/get', (req, res, next) => {
  // Product.find({'availability': true,
  //               'inventory': {$gte: 1}},function (err, products) {
  //   console.log(products);
  //   if (err) return handleError(err => {
  //     res.status(500).json(
  //       { message: 'No matching Products Found! Please check your filters again!'}
  //       );
  //   });
  //   res.status(200).json(
  //     {
  //       message: 'Product list recieved successfully!',
  //       products: products
  //     }
  //   );
  // });
});



//get selected product
scraper.get('/get/:id', (req, res, next) => {

  // Product.findOne({ product_id: req.params.id }, function (err,product) {
  //   if (err) return handleError(err => {
  //     res.status(500).json(
  //       { message: 'Error while loading product Details! Please try another time!'}
  //       );
  //   });
  //   res.status(200).json(
  //     {
  //       message: 'product recieved successfully!',
  //       product: product
  //     }
  //   );
  // });
});

// create custom HTML
function createHTML(content) {
   const message = "<h3> You have new Order on " + content.product + "</h3><hr><h4>Order ID : <b> " + content.order_id + "</b></h4><h4>Date : <b> " +content.created_date.slice(0,10) + ' ' + content.created_date.slice(11,19) + " </b></h4><h4>Quantity : <b> " + content.quantity + " </b></h4><hr><div class='text-center'><p><b> Please log in to view more details.<br><br><a class='btn btn-lg' href='evenza.biz//login'>Log In</a></b></p></div>"
   return message;
  }




module.exports = scraper;
