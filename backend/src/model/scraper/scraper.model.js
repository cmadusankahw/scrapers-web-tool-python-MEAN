const mongoose = require ("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const scraperSchema = mongoose.Schema(
  {
    scraperId: {type: String, required: true, unique: true},
    scraperName: {type: String, required: true},
    description: {type: String},
    tags: {type: [String]},
    baseURL: {type: String, required: true},
    scraperLocation: {type: String, required: true},
    script: {type: String, required: true},
    updateMode: {type: Boolean, required: true},
    updaterScript: {type: String},
    params: {
      categories:  {type: [String]},
      locations:  {type: [String]}
    },
    price:  {type: Number, required: true},
  },
  { collection : 'Scraper' }
);

scraperSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Scraper', scraperSchema );

