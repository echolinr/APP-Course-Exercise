/** 
 * Mongoose Schema for the Entity Ride
 * @author Lin Zhai
 * @version 0.0.1
 * 
 * @ Oct 17th. add comments according review feedback. Definition of ride schema.
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
    startPoint: {
        lattitude: {
            type: Number,
            required: true
        },
        longitude:{
            type: Number,
            required: true
        }
    },
    endPoint: {
        lattitude: {
            type: Number,
            required: true
        },
        longitude:{
            type: Number,
            required: true
        }
    }, 
    requestTime: {type: Date, required: true},
    pickupTime: {type: Date, required: true},
    dropOffTime: {type: Date, required: true},
    status : {type: String, enum:['REQUESTED', 'AWAITING_DRIVER', 'DRIVE_ASSIGNED', 'IN_PROGRESS', 'ARRIVED', 'CLOSED'], required: true},
    fare: {type: Number, required: true},
    route:{points:[{}]}
});

module.exports = mongoose.model('Ride', RideSchema);