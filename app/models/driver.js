/** 
 * Mongoose Schema for the Entity Driver
 * @author Clark Jeria
 * @version 0.0.3
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var DriverSchema   = new Schema({
    firstName: {type: String, minlength:1, maxlength: 15, required: true}, 
    lastName: {type: String, minlength:1, maxlength: 15, required: true}, 
    licensedState: {type: String, maxlength:2},
    emailAddress: {type: String, validate: /[a-zA-Z0-9_.]+\@[a-zA-Z](([a-zA-Z0-9-]+).)*/, required: true},   
    password: {type: String, required: true, minlength: 6, maxlength:16},
    addressLine1: {type: String, maxlength: 50},
    addressLine2: {type: String, maxlength: 50},
    city: {type: String, maxlength: 50},
    state: {type: String, maxlength: 2},
    zip: {type: String, maxlength: 5},
    phoneNumber: {type: String, required: true, validate: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/}, // phoneNumber (String, Regex XXX-XXX-XXXX, Required)
    drivingLicense: {type: String, minlength: 8, maxlength:16 },
    car: { type: Schema.Types.ObjectId, ref: 'Car' }
});

module.exports = mongoose.model('Driver', DriverSchema);