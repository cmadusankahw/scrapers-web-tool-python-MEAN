//model imports
const Scraper = require("../../model/scraper/scraper.model");
const User = require("../../model/auth/user.model");
const checkAuth = require("../../middleware/auth-check");
const email = require("../common/mail");

//dependency imports
const express = require("express");
const bodyParser = require("body-parser");
const multer = require ("multer");
const csv=require('csvtojson');
var path = require('path');
const { exec } = require("child_process");

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



// get methods

//get list of products for search
scraper.get('/user',checkAuth, (req, res, next) => {
  let scraperList = []
  User.findOne({ userId: req.userData.user_id}).then(
    user => {
      for (scp of user.scrapers){
        scraperList.push(scp.scraperId)
      }
      Scraper.find( { scraperId : { $in : scraperList } }).then(
        scrapers => {
          res.status(200).json({
            message: "User\'s Scrapers retrived!" ,
            scrapers: scrapers
          });
        }
      )
    }
  ).catch((err) => {
    console.log(err);
    res.status(500).json({ message: "User scrapers retrival failed! Please retry!" });
  })
});



//get selected scraper
scraper.get('/one/:id', (req, res, next) => {

  Scraper.findOne({ scraperId: req.params.id }, function (err,scraper) {
    if (err) return handleError(err => {
      console.log(err);
      res.status(500).json(
        { message: 'Error while retriving scraper! Please try another time!'}
        );
    });
    res.status(200).json(
      {
        message: 'scraper retrived successfully!',
        scraper: scraper
      }
    );
  });
});


//get all scrapers
scraper.get('/all', (req, res, next) => {

  Scraper.find({}, function (err,scrapers) {
    if (err) return handleError(err => {
      console.log(err);
      res.status(500).json(
        { message: 'Error while retriving scrapers! Please try another time!'}
        );
    });
    res.status(200).json(
      {
        message: 'scrapers retrived successfully!',
        scrapers: scrapers
      }
    );
  });
});


//get last scraper ID
scraper.get('/last-id', (req, res, next) => {
  Scraper.find(function (err, scrapers) {
    var lastid;
    if(scrapers.length){
      lastid = scrapers[scrapers.length-1].scraperId;
      var eId = +(lastid.slice(1));
      lastid = ('S' + (++eId).toString());
    } else {
      lastid= 'S0';
    }
    if (err) return handleError(err);
    res.status(200).json(
      {
        lastid: lastid
      }
    );
  });
});

//get scraper status
scraper.get('/status/:id',checkAuth, (req, res, next) => {

  let scraperStatus = ""
  User.findOne({ userId: req.userData.user_id}).then(
    user => {
      for (scp of user.scrapers){
        if (scp.scraperId == req.params.id) {
          scraperStatus = scp.status
        }
      }
      res.status(200).json({
        message: "User\'s Scraper status retrived!" ,
        status: scraperStatus
      });
    }).catch((err) => {
    console.log(err);
    res.status(500).json({ message: "User scraper statud retrival failed! Please retry!" });
  })
});


//get scraper JSON Data
scraper.post('/json',checkAuth, (req, res, next) => {
  jsonPath = path.join(__dirname, '..', '..','..', req.body.dataLocation);
  csv()
.fromFile(jsonPath)
.then((jsonObj)=>{
    res.status(200).json({
      message: "JSON data retrived!" ,
      JSONData: jsonObj.slice(0,30)
    });
}).catch((err) => {
  console.log(err);
  res.status(500).json({ message: "JSON data retrival failed! Please retry!" });
})
});

// download csv file
scraper.post('/csv/download',checkAuth, (req, res) => {
  filePath = path.join(__dirname, '..', '..','..', req.body.dataLocation);
  res.download(filePath, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
});


// update scraper status
scraper.post('/status',checkAuth, (req, res, next) => {
  User.findOne({ userId: req.userData.user_id}).then(
    user => {
      for (let i=0; i< user.scrapers.length; i++){
        if (user.scrapers[i].scraperId == req.body.scraperId) {
          user.scrapers[i].status = req.body.status
        }
      }
      User.updateOne({ userId: req.userData.user_id}, user)
      .then(() => {
        res.status(200).json({
          message: 'user scraper status updated successfully!',
        });
      }).catch((err) => {
        console.log(err);
      })
    }).catch((err) => {
    console.log(err);
    res.status(500).json({ message: "User scraper status update failed! Please retry!" });
  })
 });


 // run scraper
scraper.post('/exec',checkAuth, (req, res, next) => {
  const exec_keyword = "python "
  executionScript = path.join(__dirname, '..', '..','..', req.body.scraperLocation, req.body.script);
  const runId = req.body.scraperId + "_" + (new Date().toISOString().slice(0,14));
  try{
    exec(exec_keyword + executionScript, (error, stdout, stderr) => {
      // if (error) {

      // }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          res.status(200).json({
            message: `Scraper execution failed! error: ${stderr.slice(0,30) + '...'}` ,
            result: stderr,
            scraperRunId: runId,
            status: false
          });
      }
      if (stdout) {
        console.log(`stdout: ${stdout}`);
        res.status(200).json({
          message: 'user scraper status updated successfully!',
          result: stdout,
          scraperRunId: runId,
          status: true
        });
      }
  });
  } catch (err) {
    console.log(`error: ${error.message}`);
    res.status(500).json({ message: `Scraper execution failed! ${error.message}` });
  }


 });



 //remove a scraper
scraper.delete('/one/:id',checkAuth, (req, res, next) => {
  Scraper.deleteOne({scraperId: req.params.id}).then(
    result => {
      console.log(result);
      res.status(200).json({ message: "Scraper removed!" });
    }
  ).catch((err) => {
    console.log(err);
    res.status(500).json({ message: "Scraper was not removed! Please retry" });
  })
});

 //remove a scraper-run
 scraper.delete('/run/one/:scraperId/:scraperRunId',checkAuth, (req, res, next) => {
  User.findOne({ userId: req.userData.user_id}).then(
    user => {
      for (let i=0; i< user.scrapers.length; i++){
        if (user.scrapers[i].scraperId == req.params.scraperId) {
          newScraperRuns = user.scrapers[i].scraperRuns.filter(scr => scr.scraperRunId !== req.params.scraperRunId);
          user.scrapers[i].scraperRuns = newScraperRuns
        }
      }
      User.updateOne({ userId: req.userData.user_id}, user)
      .then(() => {
        res.status(200).json({
          message: 'user scraper run removed successfully!',
          userScrapers: user.scrapers
        });
      }).catch((err) => {
        console.log(err);
      })
    }).catch((err) => {
    console.log(err);
    res.status(500).json({ message: "User scraper run removal failed! Please retry!" });
  })
});


// add scraper images
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

//edit scraper
scraper.post('/one',checkAuth, (req, res, next) => {
  Scraper.updateOne({ scraperId: req.body.scraperId}, {
    scraperId: req.body.scraperId,
    scraperName: req.body.scraperName,
    description: req.body.description,
    tags: req.body.tags,
    baseURL: req.body.baseURL,
    scraperLocation: req.body.scraperLocation,
    script: req.body.script,
    updaterMode: req.body.updaterMode,
    updaterScript: req.body.updaterScript,
    params: req.body.params,
    price: req.body.price,
  })
  .then((result) => {
    console.log(result);
    res.status(200).json({
      message: 'scraper updated successfully!',
    });
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({
      message: 'Scraper update failed! Please Try Again!'
    });
  });
});


//search scrapers
scraper.post('/add', (req, res, next) => {

  const scraper = new Scraper (req.body);
  scraper.save()
  .then(() => {
    res.status(200).json({
      message: 'scraper saved successfully!',
    });
  })
  .catch( err => {
    console.log(err);
    res.status(500).json({
      message: 'Scraper saving unsuccessful! Please try again!'
    });
  });
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


// create custom HTML
function createHTML(content) {
   const message = ""
   return message;
  }


module.exports = scraper;
