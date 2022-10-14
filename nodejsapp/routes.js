var express = require("express");
var Router = express.Router();
var conn = require('./connection')

var https = require('https');
const { type } = require("os");
const { resolveAny } = require("dns");
const { verify } = require("crypto");
let data = '';

Router.get("/", (req, res) => {
    conn.query("SELECT * FROM rel_global;SELECT * from rel_pod",[1,2], (err, rows, fields) => {
        if (!err) {
            res.render('rel', { page_title: "Rel Services ", data: rows });
        }
        else {
            console.log(error);
            res.render('rel', { page_title: "Rel Services ", data: '' });

        }
    })

   
});

module.exports = Router;