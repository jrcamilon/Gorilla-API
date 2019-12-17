/**
 * Imports and Declarations
 */
let mySql = require('mysql');
let _ = require('lodash');
let env = require('../config.js');
let Errors = require('../errors');
let HttpStatus = require('http-status-codes');
let helper = require('../helper/helper');

var pool = mySql.createPool({
    connectionLimit: 10,
    host: env.host,
    user: env.user,
    password: env.password,
    database: env.database,
    connectionLimit: 100,
    charset: 'utf8mb4',
    debug: false
});

/** Test endpoint to get all records limit 10 */
exports.getAllLimit10 = (req, res, next) => {
    const query = 'select * from gorilla.ranging limit 10;';
    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({message: connectionError.message}); 
            }
            console.log(connectionError);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        } else {
            pool.query(query, (queryError, response, fields) => {
                if (!queryError) {
                    res.send(response);
                } 
                conn.release();
                console.log('connection released for query:', query);
            });
        }   
    });
};

/** Get Records by Filters */
exports.databaseTest2 = (req, res, next) => {
    console.log(req.body);
    let group = helper.convertFilterList(req.body.group);
    let label = req.body.label;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;

    const query = `SELECT lat, lng, datein, groupin, label FROM gorilla.ranging where groupin in ` + 
    `(${group})` +` and label in ('` + `${label}` +`') AND datein  BETWEEN '` 
    + `${startDate} ` + `' AND '` + `${endDate}` + `';`;


    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({error: connectionError, message: connectionError.message}); // 404
            }
            if (connectionError instanceof Errors.InternalServerError) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: connectionError, message: connectionError.message }); // 500
            }
            // console.log(connectionError);
           
        } else {
            pool.query(query, (queryError, response, fields) => {
                if (!queryError) {
                    res.send(response);
                } 
                conn.release();
            });
        }   
    });
}

/** Get Ranging Groups */
exports.getRangingGroups = (req, res, next) => {


    const query = `SELECT DISTINCT groupin from gorilla.ranging;`;
    console.log(query);
    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({message: connectionError.message}); 
            }
            console.log(connectionError);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        } else {
            pool.query(query, (queryError, response, fields) => {
                if (!queryError) {
                    res.send(response);
                } 
                conn.release();
            });
        }   
    });
}
 
