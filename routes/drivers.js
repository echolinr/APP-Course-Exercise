/** 
 * Express Route: /drivers
 * @author Lin Zhai
 * @version 0.0.1
 */
var express = require('express');
var router = express.Router();
var util = require('util');
var mongoose     = require('mongoose');

var CF = require('./commonfunc');
var Driver = require('../app/models/driver');

var newError = new Error();

router.route('/drivers') 
    /**
     * GET call for the driver entity (multiple).
     * @returns {object} A list of drivers. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Add extra error handling rules here
         */
        Driver.find(function(err, drivers){
            if(err){
                res.status(500).send(err);
                /**
                 * Wrap this error into a more comprehensive message for the end-user
                 */
            }else{
                res.json(drivers);
            }
        });
    })
    /**
     * POST call for the driver entity.
     * @param {string} firstName - The first name of the new driver
     * @param {string} lastName - The last name of the new driver
     * @param {date} dateOfBirth - The date of birth of the new driver
     * @param {string} licenseType - The license type of the new driver
     * @param {string} username - The username of the new driver
     * @param {string} password - The password of the new driver
     * @param {string} addressLine1 - The address line 1 of the new driver
     * @param {string} addressLine2 - The address line 2 of the new driver
     * @param {string} city - The city of the new driver
     * @param {string} state - The state of the new driver
     * @param {number} zip - The zip code of the new driver
     * @param {number} phoneNumber - The phone number of the new driver
     * @returns {object} A message and the driver created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post(function(req, res){
        /**
         * validation
         */
        var yc = 0, zc = 0;
        var driver = new Driver();

        for (var x in req.body) {
            yc++;
            //console.log(y+req.body[x].trim());
            /**
             * make sure attributes name are correct
             */
            if (x.trim() != "firstName" && x.trim() != "lastName" && x.trim() != "licensedState" && x.trim() != "emailAddress" &&
                x.trim() != 'password' && x.trim() != 'addressLine1' && x.trim() != 'addressLine2' && x.trim() != 'city' &&
                x.trim() != 'state' && x.trim() != 'zip' && x.trim() != 'phoneNumber' && x.trim() != 'drivingLicense' &&
                x.trim() != 'car' ) {
                newError.errType = 'ObjectID';
                newError.errMsg = util.format("Invalid attribute '%s'",x);
                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                return;
            }

            /**
             * make sure all required attributes are in place
             */
            if (x.trim() == "firstName" || x.trim() == "lastName"  || x.trim() == "emailAddress" ||
                x.trim() == 'password' || x.trim() == 'phoneNumber' || x.trim() == 'drivingLicense' ||
                x.trim() == 'licensedState' ) {
                zc++;
            }
            yc++;

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
             * check validation & prepare the value
             */
            if (x.trim() == "firstName") {
                if (req.body.firstName.trim().length < 1) {
                    newError.errType ='minlength';
                    newError.errMsg = util.format("Length is shorter than minimum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                } 
                if (req.body.firstName.trim().length > 15) {
                    //console.log(x.trim());
                    newError.errType ='maxlength';
                    newError.errMsg = util.format("Length is greater than maximum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                }
                driver.firstName = req.body.firstName;
            }
            if (x.trim() == "lastName") {
                if (req.body.lastName.trim().length < 1) {
                    newError.errType ='minlength';
                    newError.errMsg = util.format("Length is shorter than minimum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                } 
                if (req.body.lastName.trim().length > 15) {
                    //console.log(x.trim());
                    newError.errType ='maxlength';
                    newError.errMsg = util.format("Length is greater than maximum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                }
                driver.lastName = req.body.lastName;
            }
            if (x.trim() == "licensedState") {
                if (req.body.lastName.trim().length != 2) {
                    newError.errType ='notvalid';
                    newError.errMsg = util.format("Not valid value");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                } 
                driver.licensedState = req.body.licensedState;
            }
            if (x.trim() == "drivingLicense") {
                if (req.body.drivingLicense.trim().length < 8) {
                    newError.errType ='minlength';
                    newError.errMsg = util.format("Length is shorter than minimum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                } 
                if (req.body.drivingLicense.trim().length > 16) {
                    //console.log(x.trim());
                    newError.errType ='maxlength';
                    newError.errMsg = util.format("Length is greater than maximum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                }
                driver.drivingLicense = req.body.drivingLicense;                
            }
            if (x.trim() == "phoneNumber") {
                var regEx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
                /**
                 * make sure its format and value
                 */
                if (!regEx.test(req.body.phoneNumber)) {
                   newError.errType ='notvalid';
                    newError.errMsg = util.format("Not valid value");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                } 
                driver.phoneNumber = req.body.phoneNumber;
            }
            if (x.trim() == "emailAddress") {
               var regEx = /[a-zA-Z0-9_.]+\@[a-zA-Z](([a-zA-Z0-9-]+).)*/;
                /**
                 * make sure its format and value
                 */
                if (!regEx.test(req.body.emailAddress)) {
                   newError.errType ='notvalid';
                    newError.errMsg = util.format("Not valid value");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                } 
                driver.phoneNumber = req.body.emailAddress; 
            }
            if (x.trim() == "password") {
                if (req.body.password.trim().length < 6) {
                    newError.errType ='minlength';
                    newError.errMsg = util.format("Length is shorter than minimum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                } 
                if (req.body.password.trim().length > 16) {
                    //console.log(x.trim());
                    newError.errType ='maxlength';
                    newError.errMsg = util.format("Length is greater than maximum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                }
                /**
                 * need modify this part later!!!
                 * no password should be stored in plaintext
                 */
                driver.password = req.body.password;   
            }             
            if (x.trim() == "addressLine1") {
                if (req.body.addressLine1.trim().length > 50) {
                    //console.log(x.trim());
                    newError.errType ='maxlength';
                    newError.errMsg = util.format("Length is greater than maximum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                }
                driver.addressLine1 = req.body.addressLine1;   
            }             
            if (x.trim() == "addressLine2") {
                if (req.body.addressLine1.trim().length > 50) {
                    //console.log(x.trim());
                    newError.errType ='maxlength';
                    newError.errMsg = util.format("Length is greater than maximum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                }
                driver.addressLine2 = req.body.addressLine2;   
            }             
            if (x.trim() == "city") {
                if (req.body.addressLine1.trim().length > 50) {
                    //console.log(x.trim());
                    newError.errType ='maxlength';
                    newError.errMsg = util.format("Length is greater than maximum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                }
                driver.city = req.body.city;   
            }             
            if (x.trim() == "state") {
                if (req.body.addressLine1.trim().length > 2) {
                    //console.log(x.trim());
                    newError.errType ='maxlength';
                    newError.errMsg = util.format("Length is greater than maximum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                }
                driver.state = req.body.state;   
            }             
            if (x.trim() == "zip") {
                if (req.body.addressLine1.trim().length > 2) {
                    //console.log(x.trim());
                    newError.errType ='maxlength';
                    newError.errMsg = util.format("Length is greater than maximum allowed.");
                    CF.reportErrorByType(newError.errType, newError.errMsg, res);
                    return;
                }
                driver.zip = req.body.zip;   
            }             
        }

        /**
         * make sure all required attributs are there
         */
        if (zc != 7) {
            newError.errType ='required';
            newError.errMsg = util.format("Missing parameters");
            CF.reportErrorByType(newError.errType, newError.errMsg, res);
            return;
        }

        /**
         * save new drvier into db
         */
        driver.save(function(err){
            if(err){
                res.status(500).send(err);
            }else{
                res.status(201).json(driver);
            }
        });
    });

/** 
 * Express Route: /drivers/:driver_id
 * @param {string} driver_id - Id Hash of driver Object
 */
router.route('/drivers/:driver_id')
    /**
     * GET call for the driver entity (single).
     * @returns {object} the driver with Id driver_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function(req, res){
        /**
         * Add extra error handling rules here
         */
        if (!mongoose.Types.ObjectId.isValid(req.params.driver_id)) {
            res.status(404).send({errorCode: 4000});
            return;
        }

        Driver.findById(req.params.driver_id, function(err, driver){
            if(err){
                res.status(500).send(err);
            }else{
                if (!driver)
                    res.status(404).send({});
                else
                    res.json(driver);
            }
        });  
    })
    /**
     * PATCH call for the driver entity (single).
     * @param {string} firstName - The first name of the new driver
     * @param {string} lastName - The last name of the new driver
     * @param {date} dateOfBirth - The date of birth of the new driver
     * @param {string} licenseType - The license type of the new driver
     * @param {string} username - The username of the new driver
     * @param {string} password - The password of the new driver
     * @param {string} addressLine1 - The address line 1 of the new driver
     * @param {string} addressLine2 - The address line 2 of the new driver
     * @param {string} city - The city of the new driver
     * @param {string} state - The state of the new driver
     * @param {number} zip - The zip code of the new driver
     * @param {number} phoneNumber - The phone number of the new driver
     * @returns {object} A message and the driver updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function(req, res){        
        /**
         * Add aditional error handling here
         */

        Driver.findById(req.params.driver_id, function(err, driver){
            if(err){
                res.status(500).send(err);
            }else{
                for(var key in req.body) {
                    if(req.body.hasOwnProperty(key)){
                        if(key == 'firstName'){
                            /**
                             * Add extra error handling rules here
                             */
                            driver.firstName = req.body.firstName;
                        }
                        if(key == 'lastName'){
                            /**
                             * Add extra error handling rules here
                             */
                            driver.lastName = req.body.lastName;
                        }
                        if (key == "firstName") {
                            if (req.body.firstName.trim().length < 1) {
                                newError.errType ='minlength';
                                newError.errMsg = util.format("Length is shorter than minimum allowed.");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            } 
                            if (req.body.firstName.trim().length > 15) {
                                //console.log(x.trim());
                                newError.errType ='maxlength';
                                newError.errMsg = util.format("Length is greater than maximum allowed.");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            }
                            driver.firstName = req.body.firstName;
                        }
                        if (key == "lastName") {
                            if (req.body.lastName.trim().length < 1) {
                                newError.errType ='minlength';
                                newError.errMsg = util.format("Length is shorter than minimum allowed.");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            } 
                            if (req.body.lastName.trim().length > 15) {
                                //console.log(x.trim());
                                newError.errType ='maxlength';
                                newError.errMsg = util.format("Length is greater than maximum allowed.");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            }
                            driver.lastName = req.body.lastName;
                        }
                        if (key == "licensedState") {
                            if (req.body.lastName.trim().length != 2) {
                                newError.errType ='notvalid';
                                newError.errMsg = util.format("Not valid value");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            } 
                            driver.licensedState = req.body.licensedState;
                        }
                        if (key == "drivingLicense") {
                            if (req.body.drivingLicense.trim().length < 8) {
                                newError.errType ='minlength';
                                newError.errMsg = util.format("Length is shorter than minimum allowed.");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            } 
                            if (req.body.drivingLicense.trim().length > 16) {
                                //console.log(x.trim());
                                newError.errType ='maxlength';
                                newError.errMsg = util.format("Length is greater than maximum allowed.");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            }
                            driver.drivingLicense = req.body.drivingLicense;                
                        }
                        if (key == "phoneNumber") {
                            var regEx = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
                            /**
                             * make sure its format and value
                             */
                            if (!regEx.test(req.body.phoneNumber)) {
                            newError.errType ='notvalid';
                                newError.errMsg = util.format("Not valid value");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            } 
                            driver.phoneNumber = req.body.phoneNumber;
                        }
                        if (key == "emailAddress") {
                        var regEx = /[a-zA-Z0-9_.]+\@[a-zA-Z](([a-zA-Z0-9-]+).)*/;
                            /**
                             * make sure its format and value
                             */
                            if (!regEx.test(req.body.emailAddress)) {
                            newError.errType ='notvalid';
                                newError.errMsg = util.format("Not valid value");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            } 
                            driver.phoneNumber = req.body.emailAddress; 
                        }
                        if (key == "password") {
                            if (req.body.password.trim().length < 6) {
                                newError.errType ='minlength';
                                newError.errMsg = util.format("Length is shorter than minimum allowed.");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            } 
                            if (req.body.password.trim().length > 16) {
                                //console.log(key);
                                newError.errType ='maxlength';
                                newError.errMsg = util.format("Length is greater than maximum allowed.");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            }
                            /**
                             * need modify this part later!!!
                             * no password should be stored in plaintext
                             */
                            driver.password = req.body.password;   
                        }             
                        if (key == "addressLine1") {
                            if (req.body.addressLine1.trim().length > 50) {
                                //console.log(key);
                                newError.errType ='maxlength';
                                newError.errMsg = util.format("Length is greater than maximum allowed.");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            }
                            driver.addressLine1 = req.body.addressLine1;   
                        }             
                        if (key == "addressLine2") {
                            if (req.body.addressLine1.trim().length > 50) {
                                //console.log(key);
                                newError.errType ='maxlength';
                                newError.errMsg = util.format("Length is greater than maximum allowed.");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            }
                            driver.addressLine2 = req.body.addressLine2;   
                        }             
                        if (key == "city") {
                            if (req.body.addressLine1.trim().length > 50) {
                                //console.log(key);
                                newError.errType ='maxlength';
                                newError.errMsg = util.format("Length is greater than maximum allowed.");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            }
                            driver.city = req.body.city;   
                        }             
                        if (key == "state") {
                            if (req.body.addressLine1.trim().length > 2) {
                                //console.log(key);
                                newError.errType ='maxlength';
                                newError.errMsg = util.format("Length is greater than maximum allowed.");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            }
                            driver.state = req.body.state;   
                        }             
                        if (key == "zip") {
                            if (req.body.addressLine1.trim().length > 2) {
                                //console.log(key);
                                newError.errType ='maxlength';
                                newError.errMsg = util.format("Length is greater than maximum allowed.");
                                CF.reportErrorByType(newError.errType, newError.errMsg, res);
                                return;
                            }
                            driver.zip = req.body.zip;   
                        }             
                    }
                }

                driver.save(function(err){
                    if(err){
                        res.status(500).send(err);
                    }else{
                        res.json({"message" : "Driver Updated", "driverUpdated" : driver});
                    }
                });
            }
        });
    })
    /**
     * DELETE call for the driver entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function(req, res){
        /**
         * Add extra error handling rules here
         */
        Driver.remove({
            _id : req.params.driver_id
        }, function(err, driver){
            if(err){
                res.status(500).send(err);
            }else{
                res.json({"message" : "Driver Deleted"});
            }
        });
    });

module.exports = router;