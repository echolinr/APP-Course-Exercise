/** 
 * Express Route: /sessions.js
 * @author Lin Zhai
 * @version 0.0.1
 */
var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var CryptoJS = require("crypto-js"); // used to store user password
var config = require('../config'); // get our config file
var User   = require('../app/models/user'); // get our mongoose model

router.route('/sessions')
    .post(function(req, res){
        /**
         * test if if username & password is given in authentication
         */
        //console.log(req.body.name+":"+req.body.password);
        if((req.body.name == undefined) || (req.body.password == undefined)) {
            res.status(400).json({
                "errorCode": 1100, // Missing username/passord when asking for token
                "errorMsg": "Authentication failed！Please check username/password.",
                "statusCode": 404,
                "statusTxt": "Bad Request"
            }).end();
            return;
        }
        
        /**
         * find user
        */
        User.findOne({
            name: req.body.name
        }, function(err,user) {
            if (err) throw err;

            if (!user) {
                res.status(400).json({
                    "errorCode": 1100, 
                    "errorMsg": "Authentication failed！Please check username/password.",
                    "statusCode": 404,
                    "statusTxt": "Bad Request"
                }).end();
            } else if (user) {
                /**
                 * verifying password
                 */
                var hashedPassword = CryptoJS.HmacSHA1(req.body.password, "ilovecmu").toString();
                console.log("hased password:"+hashedPassword);
                console.log("stored password:"+user.password);
                if (hashedPassword != user.password) {
                    res.status(400).json({
                        "errorCode": 1100, 
                        "errorMsg": "Authentication failed！Please check username/password.",
                        "statusCode": 404,
                        "statusTxt": "Bad Request"
                    }).end();
                    return;
                 } else {
                    /**
                     * create token
                     */
                    var token = jwt.sign(user, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    res.json({
                        success: true,
                        message: 'Token is generated!',
                        token: token
                    });
                 }
                
            }
        });

    });

/**
 * route middleware to authenticate 
 */
router.use(function(req, res, next) {
    /**
     * check header or url parameters or post parameters for token
     */
	var token = ((req.body && req.body.token) ||
                 (req.query && req.query.token) ||
                 (req.headers['x-access-token']));
	
    /**
     * decode a token
     */
	if (token) {
		/**
         * verify if it's a valid token
         */
		jwt.verify(token, config.secret, function(err, decoded) {			
			if (err) {
                return res.status(400).json({
                    "errorCode": 1100, 
                    "errorMsg": "Invalid token",
                    "statusCode": 404,
                    "statusTxt": "Bad Request"
                }).end();
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {
		/**
         * Missing token, return error
         */
        return res.status(400).json({
             "errorCode": 1101, 
             "errorMsg": "Invalid token",
             "statusCode": 404,
             "statusTxt": "Bad Request"
         }).end();
	}
	
});
module.exports = router;