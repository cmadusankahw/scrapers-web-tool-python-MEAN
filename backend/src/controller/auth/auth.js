//model imports
const User = require("../../model/auth/user.model");
const EventPlanner = require("../../model/auth/eventPlanner.model");
const Merchant = require("../../model/auth/merchant.model");
const Admin = require("../../model/admin/admin.model");
const checkAuth = require("../../middleware/auth-check");
const IDVerification = require("../../model/auth/idVerification.model");
const BusinessVerification = require("../../model/auth/businessVerification.model");

//dependency imports
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require ("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require ("multer");

//express app declaration
const auth = express();


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
    cb(error,"src/assets/images/merchant");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

//middleware
auth.use(bodyParser.json());
auth.use(bodyParser.urlencoded({ extended: false }));


//functions here

// signup user
auth.post('/signup/user', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then( hash => {
      const user = new User ({
        user_id: req.body.user_id,
        email: req.body.email,
        user_type: req.body.user_type,
        password: hash,
        state: req.body.state
      });
    console.log(user);
    user.save()
      .then( result => {
        res.status(200).json({
          message: 'user added successfully!',
          result: result
        });
      })
        .catch( err => {
          res.status(500).json({
            message: 'User signup was not successfull! Please try again!'
          });
        });
    });
});

// signup merchant
auth.post('/signup/merchant', (req, res, next) => {
  const merchant = new Merchant (req.body);
  console.log(merchant);
  merchant.save()
    .then (result => {
      res.status(200).json({
        message: 'Merchant added successfully!'
      });
    })
    .catch( err => {
      res.status(500).json({
        message: 'Merchant sign up was not successfull! Please try again!'
      });
    });
});

// signup event planner
auth.post('/signup/planner', (req, res, next) => {
  const eventPlanner = new EventPlanner (req.body);
  console.log(eventPlanner);
  eventPlanner.save()
    .then( result => {
      res.status(200).json({
        message: 'Event Planner added successfully!'
      });
    })
    .catch( err => {
      res.status(500).json({
        message: 'Event Plnner Signup was not successful! Please try again!'
      });
    });
});

// add profile pic merchant
auth.post('/merchant/img',checkAuth, multer({storage:storage}).array("images[]"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  imagePath = url+ "/images/merchant/" +  req.files[0].filename;
  res.status(200).json({
    profile_pic: imagePath
  });
});

// add profile pic event planner
auth.post('/planner/img',checkAuth, multer({storage:storage}).array("images[]"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  imagePath = url+ "/images/merchant/"+  req.files[0].filename;
  res.status(200).json({
    profile_pic: imagePath
  });
});

// add profile pic event planner
auth.post('/admin/img',checkAuth, multer({storage:storage}).array("images[]"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  imagePath = url+ "/images/merchant/"+  req.files[0].filename;
  res.status(200).json({
    profile_pic: imagePath
  });
});

//edit merchant
auth.post('/merchant',checkAuth, (req, res, next) => {
  Merchant.updateOne({ user_id: req.userData.user_id}, {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    profile_pic: req.body.profile_pic,
    nic: req.body.nic,
    email: req.body.email,
    contact_no: req.body.contact_no,
    address_line1: req.body.address_line1,
    address_line2: req.body.address_line2,
    postal_code: req.body.postal_code,
    gender: req.body.gender,
    date_of_birth: req.body.date_of_birth,
    id_verification: req.body.id_verification,
    business: req.body.business
  })
  .then((result) => {
    console.log(result);
    res.status(200).json({
      message: 'merchant updated successfully!',
    });
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      message: 'Profile Details update unsuccessfull! Please Try Again!'
    });
  });
});


//edit event planner
auth.post('/planner',checkAuth, (req, res, next) => {
  EventPlanner.updateOne({ user_id: req.userData.user_id}, {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    profile_pic: req.body.profile_pic,
    email: req.body.email,
    contact_no: req.body.contact_no,
    address_line1: req.body.address_line1,
    address_line2: req.body.address_line2,
    postal_code: req.body.postal_code,
    gender: req.body.gender,
    date_of_birth: req.body.date_of_birth,
  })
  .then((result) => {
    res.status(200).json({
      message: 'event planner updated successfully!',
    });
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      message: 'Profile Details update unsuccessfull! Please Try Again!'
    });
  });
});

// update admin details
auth.post('/admin',checkAuth, (req, res, next) => {
  const user = new User (req.body);
  Admin.updateOne({ user_id: req.userData.user_id},{
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    profile_pic: req.body.profile_pic,
    email: req.body.email,
    contact_no: req.body.contact_no,
    address_line1: req.body.address_line1,
    address_line2: req.body.address_line2,
    postal_code: req.body.postal_code,
    gender: req.body.gender,
    card_details: req.body.card_details
  })
  .then((result) => {
    console.log(result);
    res.status(200).json({
      message: 'admin profile updated successfully!',
    });
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      message: 'Profile Details update unsuccessfull! Please Try Again!'
    });
  });
});


// add merchant business profile photos
auth.post('/business/img',checkAuth, multer({storage:storage}).array("images[]"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  let imagePaths = [];
  for (let f of req.files){
    imagePaths.push(url+ "/images/merchant/"+ f.filename);
  }
  res.status(200).json({imagePaths: imagePaths});
});



// add merchant photos a single image only
auth.post('/business/single/img',checkAuth, multer({storage:storage}).single("images"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
    imagePath = url+ "/images/merchant/"  + f.filename;
  res.status(200).json({imagePath: imagePath});
});

// verificatos
// id verification
auth.post('/verify/idImg',checkAuth, multer({storage:storage}).array("images[]"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  let imagePaths = [];
  for (let f of req.files){
    imagePaths.push(url+ "/images/merchant/" + f.filename);
  }
  res.status(200).json({
    imageUrls: imagePaths
  });
});

// br verification
auth.post('/verify/brImg',checkAuth, multer({storage:storage}).array("images[]"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  let imagePaths = [];
  for (let f of req.files){
    imagePaths.push(url+ "/images/merchant/" + f.filename);
  }
  res.status(200).json({
    imageUrls: imagePaths
  });
});

// id verify details
auth.post('/verify/id',checkAuth, (req, res, next) => {
  const v = {
    user_id: req.userData.user_id,
    isverified: req.body.isverified,
    id_sideA: req.body.id_sideA,
    id_sideB: req.body.id_sideB,
    issuer: req.body.issuer
  };
  var verify = new IDVerification (v);
  verify.save()
  .then(result => {
    res.status(200).json({
      message: 'ID verification details submitted for review!',
    });
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      message: 'You have already Verified! Please wait for the review!!'
    });
  });
});


// business verify details
auth.post('/verify/br',checkAuth, (req, res, next) => {
  const b = {
    user_id: req.userData.user_id,
    business_isverified: req.body.business_isverified,
    br_side_a: req.body.br_side_a,
    br_side_b:  req.body.br_side_b
  };
  var verify2 = new BusinessVerification (b);
  verify2.save()
  .then(result => {
    res.status(200).json({
      message: 'Business verification details submitted for review!',
    });
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      message: 'You have already Verified! Please wait for the review!!'
    });
  });
});




// update mrchant business profile
auth.post('/business/edit',checkAuth, (req, res, next) => {
const newBusiness = req.body;
console.log(newBusiness);
Merchant.updateOne({ user_id: req.userData.user_id}, {
  business: newBusiness
})
.then(result=>{
  res.status(200).json({
    message: 'Business Profile updated successfully!',
    result: result
  });
})
.catch(err=>{
  console.log(err);
  res.status(500).json({
    message: 'Business profile update was unsuccessful! Please try Again!'
  });
});
});




//login user
auth.post('/signin', (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
  .then( user => {
    if (!user){
      res.status(401).json(
        {
          message: 'Invalid username or password!',
        });
    }
    fetchedUser = user;
    console.log(user);
    return bcrypt.compare(req.body.password, user.password);
  })
  .then( result => {
    if (!result) {
      res.status(401).json(
        {
          message: 'Invalid username or password!',
        });
    }
    // json web token here
    const token = jwt.sign({
      email:fetchedUser.email,
      user_id: fetchedUser.user_id,
      user_type: fetchedUser.user_type
    },
    'secret_long_text_asdvBBGH##$$sdddgfg567$33',
    {expiresIn:"1h"});
    res.status(200).json({
      message: 'user authentication successfull!',
      token:token,
      expiersIn: 15000,
      user_type: fetchedUser.user_type,
    });
  })
  .catch(err => {
    res.status(401).json(
      {
        message: 'Invalid username or password!',
      });
  });
});


//get last user ID
auth.get('/last', (req, res, next) => {
  User.find(function (err, users) {
    var lastid;
    if(users.length){
      lastid = users[users.length-1].user_id;
      var eId = +(lastid.slice(1));
      lastid = ('U' + (++eId).toString());
    } else {
      lastid= 'U0';
    }
    if (err) return handleError(err);
    res.status(200).json(
      {
        lastid: lastid
      }
    );
  });
});

// get merchant logged in
auth.get('/get/merchant',checkAuth, (req, res, next) => {
  console.log(req.userData);
  Merchant.findOne({ user_id: req.userData.user_id}, function (err,merchant) {
    if (err) return handleError(err => {
      res.status(500).json(
        {
          message: 'Couldn\'t recieve Merchant Details! Please check your connetion'
        });
    });
    res.status(200).json(
      {
        message: 'Merchant recieved successfully!',
        merchant: merchant
      }
    );
  });
});


// get all moerchants for admin
auth.get('/get/merchants',checkAuth, (req, res, next) => {
  var Query =  Merchant.find();

  Query.exec( function (err,merchant) {
    console.log(merchant);
    if (err) return handleError(err => {
      console.log(err);
      res.status(500).json(
        {
          message: 'Couldn\'t recieve Merchant Details! Please check your connetion'
        });
    });
    res.status(200).json(
      {
        message: 'Merchants recieved successfully!',
        merchants: merchant
      }
    );
  });
});



// get all moerchants for admin
auth.delete('/edit/merchants',checkAuth, (req, res, next) => {

  var removeMerchantQuery =  Merchant.deleteOne({user_id: req.body.userId});
  var removeServiceQuery = Service.delete({user_id: req.body.userId});
  var removeProductQuery = Service.delete({user_id: req.body.userId});

  removeMerchantQuery.exec().then( () => {
    removeServiceQuery.exec().then( () => {
      removeProductQuery.exec().then ( ()=> {
        res.status(200).json(
          {
            message: 'Merchants removed successfully!',
          }
        );
      })
    })
  }).catch( (err) => {
    console.log(err);
    res.status(500).json(
      {
        message: 'Couldn\'t remove Merchant! Please retry!'
      });
  });
});


// get event planner logged in
auth.get('/get/planner',checkAuth, (req, res, next) => {

  EventPlanner.findOne({ user_id: req.userData.user_id }, function (err,planner) {
    if (err) return handleError(err => {
      res.status(500).json(
        {
          message: 'Couldn\'t recieve Event Planner Details! Please check your connetion'
        });
    });
    res.status(200).json(
      {
        message: 'Event Planner recieved successfully!',
        eventPlanner: planner
      }
    );
  });
});

// get event planner logged in
auth.get('/get/admin',checkAuth, (req, res, next) => {

  Admin.findOne({ user_id: req.userData.user_id }, function (err,admin) {
    if (err) return handleError(err => {
      res.status(500).json(
        {
          message: 'Couldn\'t recieve Admin Details! Please check your connetion'
        });
    });
    res.status(200).json(
      {
        message: 'Admin details recieved successfully!',
        admin: admin
      }
    );
  });
});

// get header details
auth.get('/get/header',checkAuth, (req, res, next) => {
    if (req.userData.user_type == 'eventPlanner'){
      EventPlanner.findOne({ user_id: req.userData.user_id }, function (err,planner) {
        res.status(200).json(
          {
            user_type: req.userData.user_type,
            user_name: planner.first_name,
            profile_pic: planner.profile_pic
          }
        );
      });
    }
    else if  (req.userData.user_type == 'admin') {
    Admin.findOne({ user_id: req.userData.user_id }, function (err,admin) {
      res.status(200).json(
        {
          user_type: req.userData.user_type,
          user_name: admin.first_name,
          profile_pic: admin.profile_pic
        }
      );
    });
  } else {
    Merchant.findOne({ user_id: req.userData.user_id }, function (err,merchant) {
      res.status(200).json(
        {
          user_type: req.userData.user_type,
          user_name: merchant.first_name,
          profile_pic: merchant.profile_pic
        }
      );
    });
  }

});

// get verifications

auth.get('/verify/get/id',checkAuth, (req, res, next) => {
  IDVerification.find()
  .then((result) => {
    res.status(200).json(
      {
        message: "ID verifications recieved successfully!",
        verifications: result
      });
  }).catch(err => {
    console.log(err);
    res.status(500).json(
      {
        message: 'Couldn\'t recieve ID Verification detils'
      });
  });
});

auth.get('/verify/get/br',checkAuth, (req, res, next) => {
  IDVerification.find()
  .then((result) => {
    res.status(200).json(
      {
        message: "Business verifications recieved successfully!",
        verifications: result
      });
  }).catch(err => {
    console.log(err);
    res.status(500).json(
      {
        message: 'Couldn\'t recieve Business Verification detils'
      });
  });
});

// updating verifications

auth.post('/verify/post/id',checkAuth, (req, res, next) => {
  const newId = {
    isverified: req.body.isverified,
    id_sideA: req.body.id_sideA,
    id_sideB: req.body.id_sideB,
    isuuer: req.body.issuer
  };
  Merchant.updateOne({ user_id: req.body.user_id}, {
    id_verification: newId
  })
  .then(result=>{
    IDVerification.deleteOne({user_id: req.body.user_id})
    .then( () => {
      res.status(200).json({
        message: 'ID verification updated successfully!',
      });
    }) .catch(err=>{
      console.log(err);
      res.status(500).json({
        message: 'ID verification update was unsuccessful! Please try Again!'
      });
    });
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      message: 'ID verification update was unsuccessful! Please try Again!'
    });
  });
  });


auth.post('/verify/post/br',checkAuth, (req, res, next) => {
  const newB = {
    business_isverified: req.body.business_isverified,
    br_side_a: req.body.br_side_a,
    br_side_b: req.body.br_side_b
  };
  Merchant.updateOne({ user_id: req.body.user_id}, {
    "business.business_verification": newB
  })
  .then(() => {
    BusinessVerification.deleteOne({user_id: req.body.user_id}).
    then( () => {
      res.status(200).json({
        message: 'Business  verification updated successfully!',
      });
    }).catch( err => {
      console.log(err);
      res.status(500).json({
        message: 'Business verification update was unsuccessful! Please try Again!'
      });
    })
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      message: 'Business verification update was unsuccessful! Please try Again!'
    });
  });
  });


module.exports = auth;
