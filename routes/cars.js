/** 
 * Express Route: /cars
 * @author Clark Jeria
 * @version 0.0.3
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var mongoose = require('mongoose');


var Car = require('../app/models/car');

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

router.route('/cars')
    /**
     * GET call for the car entity (multiple).
     * @returns {object} A list of cars. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function (req, res) {
        /**
         * Add extra error handling rules here
         */
        Car.find(function (err, cars) {
            if (err) {
                res.status(500).send(err);
                /**
                 * Wrap this error into a more comprehensive message for the end-user
                 */
            } else {
                res.json(cars);
            }
        });
    })
    /**
     * POST call for the car entity.
     * @param {string} license - The license plate of the new car
     * @param {integer} doorCount - The amount of doors of the new car
     * @param {string} make - The make of the new car
     * @param {string} model - The model of the new car
     * @returns {object} A message and the car created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function (req, res) {
        /**
         * Add aditional error handling here
         */
        var car = new Car();
        car.license = req.body.license;
        car.doorCount = req.body.doorCount;
        car.make = req.body.make;
        car.model = req.body.model;

        car.save(function (err) {
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
                res.status(201).json(car);
            }
        });
    });

/** 
 * Express Route: /cars/:car_id
 * @param {string} car_id - Id Hash of Car Object
 */
router.route('/cars/:car_id')
    /**
     * GET call for the car entity (single).
     * @returns {object} the car with Id car_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function (req, res) {
        /**
         * Add extra error handling rules here
         */
        if (!mongoose.Types.ObjectId.isValid(req.params.car_id)) {
            res.status(404).send({ errorCode: 4000 });
            return;
        }

        Car.findById(req.params.car_id, function (err, car) {
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
                if (!car)
                    res.sendStatus(404);
                else
                    res.json(car);
            }
        });
    })
    /**
     * PATCH call for the car entity (single).
     * @param {string} license - The license plate of the new car
     * @param {integer} doorCount - The amount of doors of the new car
     * @param {string} make - The make of the new car
     * @param {string} model - The model of the new car
     * @returns {object} A message and the car updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function (req, res) {
        /**
         * Add extra error handling rules here
         */

        Car.findById(req.params.car_id, function (err, car) {
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
                car.save(function (err) {
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
                        res.json(car);
                    }
                });
            }
        });
    })
    /**
     * DELETE call for the car entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function (req, res) {
        /**
         * Add extra error handling rules here
         */
        Car.remove({
            _id: req.params.car_id
        }, function (err, car) {
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
                res.json({ "message": "Car Deleted" });
            }
        });
    });

module.exports = router;