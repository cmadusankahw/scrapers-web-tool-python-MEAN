const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require ("path");
require('dotenv').config();

const app = express();

// to get from env
const url = "/web-scraper/v1/"

//import app segments
const auth = require ('./controller/auth/auth');
const scraper = require ('./controller/scraper/scraper');
// const scraper_run = require ('./controller/scraper/scraper-run');

mongoose.connect('mongodb+srv://admin:adminWS123@cluster0.69yxf.mongodb.net/scraper?retryWrites=true&w=majority', // mongodb+srv://:${process.env.DB_PASS}@cluster0.xnfvc.gcp.mongodb.net/evenza?retryWrites=true&w=majority    mongodb://localhost:27017/evenza
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to monogodb database..');
  })
  .catch(() => {
    console.log('Connection to database failed!');
  });

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb',extended: false }));
app.use("/images",express.static(path.join("src/assets/images/")));

//Allow CROS
app.use( (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //ToDo update in production
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});


//functions here
app.use(url+'auth', auth);
app.use(url+'scraper', scraper);
// app.use('/api/scraper-run', scraper_run);
// app.use('/api/payment', payment);

module.exports = app;
