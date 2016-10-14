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
                "errorCode": 1100, // Missing Name when asking for token
                "errorMsg": "Missing username/password",
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
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {
                    /**
                     * verifying password
                     */
                //console.log(user.password+":"+req.body.password);
                if (req.body.password != user.password) {
                        res.status(404).json({
                            "errorCode": 1101, // username does not match
                            "errorMsg": "Passowrd does not match",
                            "statusCode": 404,
                            "statusTxt": "Bad Request"
                        }).end();
                        return;
                 } else {
                        /**
                         * create token
                         */
                        //console.log("superSecret:"+config.secret);
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
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];
	
    /**
     * decode a token
     */
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, config.secret, function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
	
});
module.exports = router;