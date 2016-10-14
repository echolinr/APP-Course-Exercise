/** 
 * Express Route: /users.js
 * @author Lin Zhai
 * @version 0.0.1
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


var User = require('../app/models/user');

router.route('/users')
    /**
     * GET call for the user entity (multiple).
     * @returns {object} A list of users. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function (req, res) {
        /**
         * Add extra error handling rules here
         */
        User.find(function (err, users) {
            if (err) {
                res.status(500).send(err);
                /**
                 * Wrap this error into a more comprehensive message for the end-user
                 */
            } else {
                res.json(users);
            }
        });
    });

    module.exports = router;