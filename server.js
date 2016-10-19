/** 
 * Example of RESTful API using Express and NodeJS
 * @author Lin Zhai
 * @version 0.0.3
 * 
 * @Oct 13rd, add authentication to middleware
 * 
 */

/** BEGIN: Express Server Configuration */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan      = require('morgan');
var CryptoJS = require("crypto-js");
/**
 * get config
 */
var config = require('./config'); // get our config file

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
mongoose.connect(config.database); //connect to database
app.set('superSecret',config.secret); //secret variable
/** END: Express Server Configuration */

/** BEGIN: Express Routes Definition */
var router = require('./routes/router');
var cars = require('./routes/cars');
var drivers = require('./routes/drivers');
var passengers = require('./routes/passengers');
var paymentAccounts = require('./routes/paymentaccounts');
var rides = require('./routes/rides');
var sessions = require('./routes/sessions');
var users = require('./routes/users');

var User   = require('./app/models/user'); // get our mongoose model


app.use('/api', cars);
app.use('/api', drivers);
app.use('/api', passengers);
app.use('/api', paymentAccounts);
app.use('/api', rides);
app.use('/api', router);
app.use('/api', sessions);
app.use('/api', users);


// use morgan to log requests to the console
app.use(morgan('dev'));

/** ======================= */
/** routes ================ */
/** ======================= */
/** basic route */
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

/** API ROUTES ------------------- */
/** Setup a sample user */
app.get('/setup', function(req, res) {

  // create a sample user
  var nick = new User({ 
    name: "uttester", 
//    password : "ilovecmu",
    admin: true 
  });

  /**
   * hash password
   */
  nick.password = CryptoJS.HmacSHA1("ilovecmu", "ilovecmu").toString();
  // save the sample user
  nick.save(function(err) {
    if (err) {
      //console.log(nick.password);
       throw err;
    }

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

/** BEGIN: Express Server Start */
app.listen(port);
console.log('Service running on port ' + port);

module.exports = app;
/** END: Express Server Start */