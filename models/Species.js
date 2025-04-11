const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({
    name: String,
    scientificName: String,
    threatLevel: String,
    habitat: String,
    description: String
});

module.exports = mongoose.model('Species', speciesSchema);
