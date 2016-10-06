/** 
 * Mongoose Schema for the Entity Ride
 * @author Clark Jeria
 * @version 0.0.3
 */

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RideSchema   = new Schema({
    passenger:{type: Schema.Types.ObjectId, ref: 'Passenger'},
    driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
    car: { type: Schema.Types.ObjectId, ref: 'Car' },
    rideType: {
        type: String,
        required: true,
        validate: [{
            validator: function (val) {
                return val === 'ECONOMY' || val === 'PREMIUM' || val === 'EXECUTIVE';
            },
            msg: 'invaild ride type, you can only choose ECONOMY / PREMIUM / EXECUTIVE',
            type: 'notvalid'
        }]
    },
    startPoint: {type: Number},
    endPoint: {type: Number}, 
    requestTime: {type: Date},
    pickupTime: {type: Date},
    dropOffTime: {type: Date},
    status : ['REQUESTED', 'AWAITING_DRIVER', 'DRIVE_ASSIGNED', 'IN_PROGRESS', 'ARRIVED', 'CLOSED'],
    fare: {type: Number},
    route:{type: Number}
});

module.exports = mongoose.model('Ride', RideSchema);