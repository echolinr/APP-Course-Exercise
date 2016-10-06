/** 
 * Mongoose Schema for the Entity PaymentAccount
 * @author Clark Jeria
 * @version 0.0.1
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PaymentAccountSchema   = new Schema({
    accountType: {type: String, length: 18, required: true},
    accountNumber: {type: Number, length: 18, required: true},
    expirationDate: {type: Number}, // - expirationDate (Number, Timestamp, Required for passenger accounts only)
    nameOnAccount: {type: String, length: 18, required: true},
    driver_id: {type: String, ref: 'Driver'},
    passenger_id: {type: String, ref: 'Passenger'},
    bank: {type: String, length: 18, required: true} // - bank (String, 18, Required for driver accounts only)
});

module.exports = mongoose.model('PaymentAccount', PaymentAccountSchema);