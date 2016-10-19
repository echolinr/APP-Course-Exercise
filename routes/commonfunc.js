'use strict';

var express = require('express');
var router = express.Router();
var util = require('util');

//const conf = require('../config');
//const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');

/**
 * report error 
 * 
 * @param {any} errType
 * @param {any} errMsg
 * @param {any} res Express's response object
 */
function reportErrorByType(errType, errMsg, res) {
    /**
     * status code 400 means 'bad request'
     */
    switch(errType) {
        // not found
        case 'ObjectId':
            res.status(404).json({message: errMsg, errorCode: 1001}).end();
            return;
        // longer than maxlength
        case 'maxlength':
            res.status(400).json({message: errMsg, errorCode: 1002}).end();
            return;
        // shorter than minlength
        case 'minlength':
            res.status(400).json({message: errMsg, errorCode: 1002}).end();
            return;
        // missing params
        case 'required':
            res.status(400).json({message: errMsg, errorCode: 1003}).end();
            return;
        case 'duplicated':
            res.status(400).json({message: errMsg, errorCode: 1004}).end();
            return;   
        case 'emptyValue':
           res.status(400).json({message: errMsg, errorCode: 1005}).end();
            return;   
        case 'notvalid':
            res.status(400).json({message: errMsg, errorCode: 1006}).end();
            return;       
        case 'missingObject':
            res.status(400).json({message: errMsg, errorCode: 1007}).end();
            return;       
 // uncaught error type
        default:
            res.status(400).json({message: errMsg, errorCode: 1009}).end();
            return;
    }
}

module.exports = {
    reportErrorByType,
}