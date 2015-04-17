/**
 * Created by lrollus on 06/06/14.
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('Server', {
    url : String,
    privateKey : String,
    publicKey: String,
    version: String,
    status : Number,
    lastUpdateStatus : Date,
    lastSuccessStatus : Date,
    downNumber : {type: Number, default: 0},
    ping : Number
});