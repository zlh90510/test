var mongoose = require('mongoose');
var config = require('./config.js');

module.exports = function () {

    require('../models/users.server.model.js');

    return mongoose.connect(config.mongodb);
};