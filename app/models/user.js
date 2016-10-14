
/** 
 * Mongoose Schema for the Entity Ride
 * @author Lin Zhai 
 * @version 0.0.1
 */

// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    name: {type: String},
    password: {type: String},
    admin: {type: Boolean}
});

module.exports = mongoose.model('User', UserSchema);
