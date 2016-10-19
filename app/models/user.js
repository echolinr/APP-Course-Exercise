
/** 
 * Mongoose Schema for the Entity User
 * @author Lin Zhai 
 * @version 0.0.1
 * 
 * @ Oct 17th. add comments according review feedback. Definition of user schema.
 *             This is the user for db operation. May not related to passenger/rider
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
