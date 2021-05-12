const mongoose = require ("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema(
  {
    userId: {type: String, required: true, unique: true},
    userName: {type: String, required: true},
    userType: {type: String, required: true},
    profilePic: {type: String},
    userEmail: {type: String, required: true},
    userContactNo: {type: String, required: true},
    status: {type: String, required: true},
    scrapers: { type: [{
      scraperId: {type: String, required: true},
      scraperName: {type: String, required: true},
      status: {type: String, required: true},
      scraperRuns: {type: [
        {
        scraperRunId: {type: String, required: true},
        timestamp: {type: Number, required: true},
        noOfRuns:  {type: Number, required: true},
        noOfCols:  {type: Number},
        noOfRows:  {type: Number},
        executionType: {type: String, required: true},
        executed_params:{
          categories: {type: [String]},
          locations:  {type: [String]},
        },
        dataLocation: {type: String, required: true},
        dataFormat: {type: String, required: true},
        status: {type: String, required: true},
       }]
      },
    }]
  }
  }
  ,
  { collection : 'User' }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

