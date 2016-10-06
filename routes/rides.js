/** 
 * Express Route: /rides
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var mongoose = require('mongoose');


var Ride = require('../app/models/ride');

function reportErrorByType(errType, errMsg, res) {
    switch (errType) {
        // not found
        case 'ObjectId':
            res.status(404).json({ message: errMsg, errorCode: 1001 }).end();
            return;
        // longer than maxlength
        case 'maxlength':
            res.status(400).json({ message: errMsg, errorCode: 1002 }).end();
            return;
        // shorter than minlength
        case 'minlength':
            res.status(400).json({ message: errMsg, errorCode: 1002 }).end();
            return;
        // missing params
        case 'required':
            res.status(400).json({ message: errMsg, errorCode: 1003 }).end();
            return;
        // uncaught error type
        default:
            res.status(400).json({ message: errMsg, errorCode: 1004 }).end();
            return;
    }
}

router.route('/rides')
    /**
     * GET call for the ride entity (multiple).
     * @returns {object} A list of rides. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function (req, res) {
        /**
         * Add extra error handling rules here
         */
        Ride.find(function (err, rides) {
            if (err) {
                res.status(500).send(err);
                /**
                 * Wrap this error into a more comprehensive message for the end-user
                 */
            } else {
                res.json(rides);
            }
        });
    })
    /**
     * POST call for the ride entity.
     * @param {string} license - The license plate of the new ride
     * @param {integer} doorCount - The amount of doors of the new ride
     * @param {string} make - The make of the new ride
     * @param {string} model - The model of the new ride
     * @returns {object} A message and the ride created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function (req, res) {
        /**
         * Add aditional error handling here
         */
        var ride = new Ride();
        ride.license = req.body.license;
        ride.doorCount = req.body.doorCount;
        ride.make = req.body.make;
        ride.model = req.body.model;

        ride.save(function (err) {
            if (err) {
                if (err.errors) {
                    var curErr = err.errors
                    var curErr = err.errors;
                    for (var key in curErr) {
                        // only report once
                        reportErrorByType(curErr[key].kind, curErr[key].message, res);
                        break;
                    }
                } else if (err.kind) {
                    reportErrorByType(err.kind, err.message, res);
                }
            } else {
                res.status(201).json(ride);
            }
        });
    });

/** 
 * Express Route: /rides/:ride_id
 * @param {string} ride_id - Id Hash of Ride Object
 */
router.route('/rides/:ride_id')
    /**
     * GET call for the ride entity (single).
     * @returns {object} the ride with Id ride_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function (req, res) {
        /**
         * Add extra error handling rules here
         */
        if (!mongoose.Types.ObjectId.isValid(req.params.ride_id)) {
            res.status(404).send({ errorCode: 4000 });
            return;
        }

        Ride.findById(req.params.ride_id, function (err, ride) {
            if (err) {
                if (err.errors) {
                    var curErr = err.errors
                    for (var key in curErr) {
                        // only report once
                        reportErrorByType(curErr.kind, curErr.message, res);
                        break;
                    }
                } else if (err.kind) {
                    reportErrorByType(err.kind, err.msg, res);
                }
            } else {
                if (!ride)
                    res.sendStatus(404);
                else
                    res.json(ride);
            }
        });
    })
    /**
     * PATCH call for the ride entity (single).
     * @param {string} license - The license plate of the new ride
     * @param {integer} doorCount - The amount of doors of the new ride
     * @param {string} make - The make of the new ride
     * @param {string} model - The model of the new ride
     * @returns {object} A message and the ride updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function (req, res) {
        /**
         * Add extra error handling rules here
         */

        Ride.findById(req.params.ride_id, function (err, ride) {
            if (err) {
                if (err.errors) {
                    var curErr = err.errors
                    for (var key in curErr) {
                        // only report once
                        reportErrorByType(curErr.kind, curErr.message, res);
                        break;
                    }
                } else if (err.kind) {
                    reportErrorByType(err.kind, err.msg, res);
                }
            } else {
                ride.save(function (err) {
                    if (err) {
                        if (err.errors) {
                            var curErr = err.errors
                            for (var key in curErr) {
                                // only report once
                                reportErrorByType(curErr.kind, curErr.message, res);
                                break;
                            }
                        } else if (err.kind) {
                            reportErrorByType(err.kind, err.msg, res);
                        }
                    } else {
                        res.json(ride);
                    }
                });
            }
        });
    })
    /**
     * DELETE call for the ride entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function (req, res) {
        /**
         * Add extra error handling rules here
         */
        Ride.remove({
            _id: req.params.ride_id
        }, function (err, ride) {
            if (err) {
                if (err.errors) {
                    var curErr = err.errors
                    for (var key in curErr) {
                        // only report once
                        reportErrorByType(curErr.kind, curErr.message, res);
                        break;
                    }
                } else if (err.kind) {
                    reportErrorByType(err.kind, err.msg, res);
                }
            } else {
                res.json({ "message": "Ride Deleted" });
            }
        });
    });

module.exports = router;