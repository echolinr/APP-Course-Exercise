/** 
 * Express Route: /cars
 * @author Lin Zhai
 * @version 0.0.4
 * 
 * @Oct 13th: Add post validation for car's attributs
 * 
 * 
 */
var express = require('express');
var router = express.Router();
var util = require('util');

var mongoose = require('mongoose');


var Car = require('../app/models/car');
var CF = require('./commonfunc');
var newError = new Error();


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
         * validation
         */
        var y = 0;
        for (var x in req.body) {
            y++;
            //console.log(y+req.body[x].trim());
            /**
             * make sure attributes name are correct
             */
            if (x.trim() != "make" && x.trim() != "doorCount" && x.trim() != "license" && x.trim() != "model") {
                //console.log(x.trim());
                newError.errType = 'ObjectID';
                newError.errMsg = util.format("Invalid attribute '%s'",x);
                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                return;
            }

            /**
             * make sure no duplicate attribute
             */
            if (req.body[x] instanceof Array) {
                newError.errType = 'duplicated';
                newError.errMsg = util.format("Duplicated attribute '%s'",x);
                CF.reportErrorByType(newError.errType,newError.errMsg, res);
                return;
            }

            /** 
             * make sure no empty value
             */
            if (req.body[x] == "") {
                newError.errType ='emptyValue';
                newError.errMsg = util.format("Missing value for attribute '%s'",x);
                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                return;
            } else {
                /**
                 * make sure value in valide range
                 */
                if (x.trim() == "make" && req.body.make.trim().length > 8) {
                    //console.log(x.trim());
                    newError.errType ='maxlength';
                    newError.errMsg = util.format("Length is greater than maximum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                }

                if (x.trim() == "model" && req.body.model.trim().length > 18) {
                    //console.log(x.trim());
                    newError.errType ='maxlength';
                    newError.errMsg = util.format("Length is greater than maximum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                }

                if (x.trim() == "license" && req.body.license.trim().length > 10) {
                    //console.log(x.trim());
                    newError.errType ='maxlength';
                    newError.errMsg = util.format("Length is greater than maximum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                }

                if (x.trim() == "doorCount" && (Number(req.body.doorCount) < 1 || Number(req.body.doorCount) > 8)) {
                    //console.log(x.trim());
                    newError.errType ='notvalid';
                    newError.errMsg = util.format("Not valid value.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                }

            }


        }

        /**
         * make sure all attributs are there
         */
        if (y != 4) {
            newError.errType ='missingObject';
            newError.errMsg = util.format("Not enough objects");
            CF.reportErrorByType(newError.errType, newError.errMsg, res);
            return;
        }


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
                        /**
                         * more than one error, we just report once
                         */
                        CF.reportErrorByType(curErr.kind, curErr.message, res);
                        break;
                    }
                } else if (err.kind) {
                    CF.reportErrorByType(err.kind, err.msg, res);
                }
            } else {
                /**
                 * status code 201 means created.
                 */
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
            /**
             * status code 404: entry not found
             */
            res.status(404).send({ errorCode: 4000 });
            return;
        }

        Car.findById(req.params.car_id, function (err, car) {
            if (err) {
                if (err.errors) {
                    var curErr = err.errors
                    for (var key in curErr) {
                        /**
                         * more than one error, we just report once
                         */
                       CF.reportErrorByType(curErr.kind, curErr.message, res);
                        break;
                    }
                } else if (err.kind) {
                    CF.reportErrorByType(err.kind, err.msg, res);
                }
            } else {
                if (!car)
                    /**
                     * status code 404: entry not found
                     */
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
                        CF.reportErrorByType(curErr.kind, curErr.message, res);
                        break;
                    }
                } else if (err.kind) {
                    CF.reportErrorByType(err.kind, err.msg, res);
                }
            } else {
                /**
                 * copy attribute
                 */
                for (var attributes in   req.body) {
                    car[attributes] = req.body[attributes];
                }
                /**
                 * update the entry
                 */
                car.save(function (err) {
                    if (err) {
                        if (err.errors) {
                            var curErr = err.errors
                            for (var key in curErr) {
                                /**
                                 * more than one error, we just report once
                                 */
                                CF.reportErrorByType(curErr.kind, curErr.message, res);
                                break;
                            }
                        } else if (err.kind) {
                            /**
                             * more than one error, we just report once
                             */
                            CF.reportErrorByType(err.kind, err.msg, res);
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
                        /**
                         * more than one error, we just report once
                        */
                        CF.reportErrorByType(curErr.kind, curErr.message, res);
                        break;
                    }
                } else if (err.kind) {
                    CF.reportErrorByType(err.kind, err.msg, res);
                }
            } else {
                res.json({ "message": "Car Deleted" });
            }
        });
    });

module.exports = router;