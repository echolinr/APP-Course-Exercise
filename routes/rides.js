/** 
 * Express Route: /rides
 * @author Lin Zhai
 * @version 0.0.2
 * 
 * @Oct 19th, add methods according project requirement and code review feedback
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var mongoose = require('mongoose');


var Ride = require('../app/models/ride');
var CF = require('./commonfunc');
var newError = new Error();

router.route('/rides')
    /**
     * GET call for the ride entity (multiple).
     * @returns {object} A list of rides. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function (req, res) {
    /**
     * GET call for the ride entity (multiple).
     * @returns {object} A list of ridess. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
        Ride.find(function (err, rides) {
            if (err) {
                res.status(500).send(err);
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
        var ride = new Ride(req.body);

        ride.save(function (err) {
            if (err) {
                if (err.errors) {
                    var curErr = err.errors;
                    for (var key in curErr) {
                        /**
                         * just report once
                         */
                        CF.reportErrorByType(curErr[key].kind, curErr[key].message, res);
                        break;
                    }
                } else if (err.kind) {
                    CF.reportErrorByType(err.kind, err.message, res);
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
         * test id
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
                        /**
                         * just report once
                         */
                        CF.reportErrorByType(curErr.kind, curErr.message, res);
                        break;
                    }
                } else if (err.kind) {
                    CF.reportErrorByType(err.kind, err.msg, res);
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
         * test id
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
                        /**
                         * just report once
                         */
                        CF.reportErrorByType(curErr.kind, curErr.message, res);
                        break;
                    }
                } else if (err.kind) {
                    CF.reportErrorByType(err.kind, err.msg, res);
                }
            } else {
                /**
                 * find one entry, update the attributes
                 */
                for (var attribute in req.body) {
                    ride[attribute] = req.body[attribute];
                }
                /**
                 * save the entry and catch error.
                 */
                ride.save(function (err) {
                    if (err) {
                        if (err.errors) {
                            var curErr = err.errors
                            for (var key in curErr) {
                        /**
                         * just report once
                         */
                                CF.reportErrorByType(curErr.kind, curErr.message, res);
                                break;
                            }
                        } else if (err.kind) {
                            CF.reportErrorByType(err.kind, err.msg, res);
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
         * test id
         */
        if (!mongoose.Types.ObjectId.isValid(req.params.ride_id)) {
            res.status(404).send({ errorCode: 4000 });
            return;
        }

        Ride.remove({
            _id: req.params.ride_id
        }, function (err, ride) {
            if (err) {
                if (err.errors) {
                    var curErr = err.errors
                    for (var key in curErr) {
                        // only report once
                        CF.reportErrorByType(curErr.kind, curErr.message, res);
                        break;
                    }
                } else if (err.kind) {
                    CF.reportErrorByType(err.kind, err.msg, res);
                }
            } else {
                res.json({ "message": "Ride Deleted" });
            }
        });
    });


/**
 * Here you must add the routes for the Ride entity
 * /rides/:id/routePoints (POST)
 * /rides/:id/routePoints (GET)
 * /rides/:id/routePoint/current (GET)
 */
router.route('/rides/:ride_id/routePoints')
    /**
     * GET call for the ride entity (single).
     * @returns {object} the ride with Id ride_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function (req, res) {

        /**
         * test id
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
                        /**
                         * just report once
                             */
                        CF.reportErrorByType(curErr.kind, curErr.message, res);
                        break;
                    }
                } else if (err.kind) {
                    CF.reportErrorByType(err.kind, err.msg, res);
                }
            } else {
                if (!ride)
                    res.sendStatus(404);
                else
                    res.json(ride);
            }
        });
    })


    .post(function(req, res) {
        Ride.findById(req.params.ride_id, function(err, ride){
            if(err) {
                CF.reportErrorByType(err.kind, err.msg, res);
            } else {
                ride.points = req.body;
                ride.save(function(err){
                    if(err){
                        CF.reportErrorByType(err.kind, err.message, res);
                        return;
                    } else {
                        res.json(ride);
                    }
                });
            };
        });
    });

router.route('/rides/:ride_id/routePoints/current')
    /**
     * GET call for the ride entity (single).
     * @returns {object} the ride with Id ride_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        Ride.findById(req.params.ride_id, function(err, ride){
            if(err){
                CF.reportErrorByType(err.kind, err.message, res);
            } else {
                var current = ride.route.slice(-1)[0];
                res.json(current);
            };
        });
    });

module.exports = router;